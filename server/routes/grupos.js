import express from "express";
import { pool } from "../server.js";
import {
  authenticateToken,
  requireAdmin,
  checkSedeAccess,
} from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import { MethodNotImplementedError } from "pdf-lib";

const router = express.Router();

// Get all groups with role-based access control
router.get("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    let query;
    let params = [];

    // If admin, show all groups
    if (req.user.rol === 0) {
      query = `
        SELECT
          g.*,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_instructora,
          CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_mentora
        FROM
          grupo g
        LEFT JOIN
          colaborador c ON g.id_grupo = c.id_grupo AND c.rol = 'Instructora'
        LEFT JOIN
          mentora_grupo mg ON g.id_grupo = mg.id_grupo
        LEFT JOIN
          mentora m ON mg.id_mentora = m.id_mentora
      `;
    }
    // If sede coordinator, only show groups from their sede
    else if (req.user.rol === 1 && req.user.id_sede) {
      query = `
        SELECT
          g.*,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_instructora,
          CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_mentora
        FROM
          grupo g
        LEFT JOIN
          colaborador c ON g.id_grupo = c.id_grupo AND c.rol = 'Instructora'
        LEFT JOIN
          mentora_grupo mg ON g.id_grupo = mg.id_grupo
        LEFT JOIN
          mentora m ON mg.id_mentora = m.id_mentora
        WHERE
          g.id_sede = $1
      `;
      params.push(req.user.id_sede);
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching grupos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

// Add a new group
router.post("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    const { idioma, nivel, cupo } = req.body;

    // Use the sede ID from the authenticated user

    // For admins who don't have a sede ID, they must specify one
    if (req.user.rol === 0) {
      return res.status(400).json({
        success: false,
        message: "Cooridnadoras nacionales no pueden agregar grupos",
      });
    }

    // Use provided id_sede for admins
    const id_sede = req.user.id_sede;

    const result = await pool.query(
      `INSERT INTO grupo (
        idioma,
        nivel,
        cupo,
        id_sede
      ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [idioma, nivel, cupo, id_sede],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get group details by ID
router.get("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    const { id } = req.params;

    // Get the group first to check permissions
    const groupCheck = await pool.query(
      "SELECT id_sede FROM grupo WHERE id_grupo = $1",
      [id],
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user has access to this group
    const groupSedeId = groupCheck.rows[0].id_sede;

    if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to access this group",
      });
    }

    // Get detailed info excluding id_grupo and id_sede
    const result = await pool.query(
      `SELECT
        idioma,
        nivel,
        cupo,
        estado
      FROM grupo
      WHERE id_grupo = $1`,
      [id],
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener datos del grupo",
      error: error.message,
    });
  }
});

// Update group details
router.put("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { idioma, nivel, cupo } = req.body;

    // Get the group first to check permissions
    const groupCheck = await pool.query(
      "SELECT id_sede FROM grupo WHERE id_grupo = $1",
      [id],
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user has access to this group (for coordinators)
    const groupSedeId = groupCheck.rows[0].id_sede;
    if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to modify this group",
      });
    }

    const result = await pool.query(
      `UPDATE grupo SET
        idioma = $1,
        nivel = $2,
        cupo = $3,
      WHERE id_grupo = $4
      RETURNING *`,
      [idioma, nivel, cupo, id],
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar datos del grupo",
      error: error.message,
    });
  }
});

// Delete group and associated mentora_grupo records
router.delete("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;

  try {
    // Get the group first to check permissions
    const groupCheck = await pool.query(
      "SELECT id_sede FROM grupo WHERE id_grupo = $1",
      [id],
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user has access to this group (for coordinators)
    const groupSedeId = groupCheck.rows[0].id_sede;
    if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to delete this group",
      });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // First delete records from mentora_grupo table
    await pool.query("DELETE FROM mentora_grupo WHERE id_grupo = $1", [id]);

    // Then delete the group
    await pool.query("DELETE FROM grupo WHERE id_grupo = $1", [id]);

    // Commit transaction
    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Grupo y asignaciones de mentoras eliminados correctamente",
    });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando grupo:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el grupo",
      error: error.message,
    });
  }
});

//Lista los participantes, colaboradores actuales
router.get(
  "/:id/listado",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to access this group's data",
        });
      }

      // Get all participantes and colaboradores for this group
      const result = await pool.query(
        `
    SELECT
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_completo,
        'Participante' AS rol,
        p.id_participante AS id
    FROM
        participante p
    WHERE
        p.id_grupo = $1 -- Replace 1 with the specific id_grupo you are querying for

    UNION ALL

    SELECT
        CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo,
        c.rol AS rol, -- Assumes the 'colaborador' table has a 'rol' column
        c.id_colaborador AS id
    FROM
        colaborador c
    WHERE
        c.id_grupo = $1; -- Replace 1 with the specific id_grupo you are querying for
      `,
        [id],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error(
        "Error fetching group participantes y colaboradores:",
        error,
      );
      res.status(500).json({
        success: false,
        message: "Error al obtener participantes y colaboradores del grupo",
        error: error.message,
      });
    }
  },
);

//delete an integrante of the group
router.put(
  "/:id/listado/:id_integrante",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id, id_integrante } = req.params;
      const { rol } = req.body;
      // Check if the group exists
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }
      // Begin transaction
      await pool.query("BEGIN");
      //participante
      if (rol === "Participante") {
        await pool.query(
          "UPDATE participante SET id_grupo = NULL WHERE id_participante = $1",
          [id_integrante],
        );

        //colaboradores
      } else {
        await pool.query(
          "UPDATE colaborador SET id_grupo = NULL WHERE id_colaborador = $1",
          [id_integrante],
        );
      }

      // Commit transaction
      await pool.query("COMMIT");

      res.json({
        success: true,
        message: "Integrante eliminado",
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("Error eliminando el integrante :", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener integrantes del grupo",
        error: error.message,
      });
    }
  },
);

//Lista de colaboradores en el grupo
router.get(
  "/:id/colaboradores",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to access this group's data",
        });
      }

      // Get all collaborators for this group
      const result = await pool.query(
        `SELECT
          c.*,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_colaborador
      FROM
          colaborador c
      WHERE c.id_grupo = $1;`,
        [id],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching group collaborators:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener colaboradores del grupo",
        error: error.message,
      });
    }
  },
);

// Lista de colaboradores que pueden ser asignados al grupo
router.get(
  "/:id/colaboradoresDisponibles",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to access this group's data",
        });
      }

      // Get all collaborators for this group
      const result = await pool.query(
        `SELECT
          c.*,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_colaborador
      FROM
          colaborador c
      WHERE c.id_grupo IS null AND c.id_sede = $1 AND c.estado = 'Aceptado';`,
        [groupSedeId],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching group collaborators:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener colaboradores del grupo",
        error: error.message,
      });
    }
  },
);

// Add a collaborator to a group
router.post(
  "/:id/colaboradoresDisponibles",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params; // Group ID
      const { id_colaborador } = req.body; // Collaborator ID

      if (!id_colaborador) {
        return res.status(400).json({
          success: false,
          message: "El ID del colaborador es requerido",
        });
      }

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Check if the collaborator exists
      const collaboratorCheck = await pool.query(
        "SELECT id_colaborador, id_sede FROM colaborador WHERE id_colaborador = $1",
        [id_colaborador],
      );

      if (collaboratorCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Colaborador no encontrado",
        });
      }

      // Check if collaborator belongs to the same sede as the group
      const collaboratorSedeId = collaboratorCheck.rows[0].id_sede;
      if (collaboratorSedeId !== groupSedeId) {
        return res.status(400).json({
          success: false,
          message:
            "El colaborador debe pertenecer a la misma sede que el grupo",
        });
      }

      // Update the collaborator's group
      const result = await pool.query(
        "UPDATE colaborador SET id_grupo = $1 WHERE id_colaborador = $2 RETURNING *",
        [id, id_colaborador],
      );

      res.status(200).json({
        success: true,
        message: "Colaborador asignado al grupo exitosamente",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error assigning collaborator to group:", error);
      res.status(500).json({
        success: false,
        message: "Error al asignar colaborador al grupo",
        error: error.message,
      });
    }
  },
);

// Remove a colaborador from a group
router.put(
  "/:id/colaboradores/:id_colaborador",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id, id_colaborador } = req.params;

      // Check if the group exists
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Update the colaborador's group to NULL
      const result = await pool.query(
        `UPDATE colaborador
       SET id_grupo = NULL
       WHERE id_colaborador = $1 AND id_grupo = $2
       RETURNING *`,
        [id_colaborador, id],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "El colaborador no está asignado a este grupo",
        });
      }

      res.status(200).json({
        success: true,
        message: "Colaborador removido del grupo exitosamente",
      });
    } catch (error) {
      console.error("Error removing colaborador from group:", error);
      res.status(500).json({
        success: false,
        message: "Error al remover colaborador del grupo",
        error: error.message,
      });
    }
  },
);

// Lista de mentoras que pueden ser asignadas al grupo
router.get(
  "/:id/mentorasDisponibles",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to access this group's data",
        });
      }

      // Get all mentoras for this sede that aren't assigned to this group
      const result = await pool.query(
        `SELECT
        m.*,
        CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_mentora
      FROM
        mentora m
      WHERE
        m.id_sede = $1
        AND m.id_mentora NOT IN (
          SELECT id_mentora FROM mentora_grupo WHERE id_grupo = $2
        )`,
        [groupSedeId, id],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching available mentoras:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener mentoras disponibles",
        error: error.message,
      });
    }
  },
);

// Get the mentora of a group
router.get(
  "/:id/mentoras",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params; // Group ID
      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para ver este grupo",
        });
      }

      // get mentora
      const mentora = await pool.query(
        "SELECT id_mentora  FROM mentora_grupo WHERE id_grupo = $1",
        [id],
      );
      // console.log("MENTORA");
      // console.log(mentora);
      // console.log(mentora.rows[0].id_mentora);

      //check if the group has a mentora
      if (!mentora.rows[0]) {
        return res.status(200).json({
          success: true,
          message: "Mentora(s) del grupo obtenida(s) exitosamente",
          data: null,
        });
      }

      // Get mentora(s) assigned to the group with their details
      const mentoraResult = await pool.query(
        `SELECT
           m.id_mentora,
           m.nombre,
           m.apellido_paterno,
           m.apellido_materno,
           CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_completo,
           m.correo,
           m.id_sede
        FROM mentora m
         WHERE id_mentora = $1`,
        [mentora.rows[0].id_mentora],
      );

      // If a group is expected to have only one mentora, you might send mentoraResult.rows[0]
      // If multiple, send mentoraResult.rows

      res.status(200).json({
        success: true,
        message: "Mentora(s) del grupo obtenida(s) exitosamente",
        data: mentoraResult.rows[0],
      });
    } catch (error) {
      console.error("Error al ver mentora to group:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener la(s) mentora(s) del grupo",
        error: error.message,
      });
    }
  },
);

// Add a mentora to a group
router.post(
  "/:id/mentoras",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params; // Group ID
      const { id_mentora } = req.body; // Mentora ID

      if (!id_mentora) {
        return res.status(400).json({
          success: false,
          message: "El ID de la mentora es requerido",
        });
      }

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Check if the mentora exists
      const mentoraCheck = await pool.query(
        "SELECT id_mentora, id_sede FROM mentora WHERE id_mentora = $1",
        [id_mentora],
      );

      if (mentoraCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Mentora no encontrada",
        });
      }

      // Check if mentora belongs to the same sede as the group
      const mentoraSedeId = mentoraCheck.rows[0].id_sede;
      if (mentoraSedeId !== groupSedeId) {
        return res.status(400).json({
          success: false,
          message: "La mentora debe pertenecer a la misma sede que el grupo",
        });
      }

      // Check if the mentora is already assigned to this group
      const existingAssignment = await pool.query(
        "SELECT * FROM mentora_grupo WHERE id_grupo = $1 AND id_mentora = $2",
        [id, id_mentora],
      );

      if (existingAssignment.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "La mentora ya está asignada a este grupo",
        });
      }

      // Add the mentora to the group via the junction table
      const result = await pool.query(
        "INSERT INTO mentora_grupo(id_grupo, id_mentora) VALUES($1, $2) RETURNING *",
        [id, id_mentora],
      );

      res.status(200).json({
        success: true,
        message: "Mentora asignada al grupo exitosamente",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error assigning mentora to group:", error);
      res.status(500).json({
        success: false,
        message: "Error al asignar mentora al grupo",
        error: error.message,
      });
    }
  },
);

// Remove a mentora from a group
router.delete(
  "/:id/mentoras/:id_mentora",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id, id_mentora } = req.params;

      // Check if the group exists
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Delete the record from mentora_grupo junction table
      const result = await pool.query(
        `DELETE FROM mentora_grupo
       WHERE id_mentora = $1 AND id_grupo = $2
       RETURNING *`,
        [id_mentora, id],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "La mentora no está asignada a este grupo",
        });
      }

      res.status(200).json({
        success: true,
        message: "Mentora removida del grupo exitosamente",
      });
    } catch (error) {
      console.error("Error removing mentora from group:", error);
      res.status(500).json({
        success: false,
        message: "Error al remover mentora del grupo",
        error: error.message,
      });
    }
  },
);

// Lista de participantes que pueden ser asignados al grupo
router.get(
  "/:id/participantesDisponibles",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to access this group's data",
        });
      }

      // Get all participantes for this sede that aren't assigned to a group
      const result = await pool.query(
        `SELECT
          p.*,
          CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_participante
      FROM
          participante p
      WHERE p.id_grupo IS NULL AND p.id_sede = $1 AND p.estado = 'Aceptado'`,
        [groupSedeId],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching available participantes:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener participantes disponibles",
        error: error.message,
      });
    }
  },
);

// Add a participante to a group
router.post(
  "/:id/participantes",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params; // Group ID
      const { id_participante } = req.body; // Participante ID

      if (!id_participante) {
        return res.status(400).json({
          success: false,
          message: "El ID del participante es requerido",
        });
      }

      // Get the group first to check permissions
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      const capacity = await pool.query("SELECT check_group_capacity($1)", [
        id,
      ]);

      if (capacity.rows[0].check_group_capacity === false) {
        return res.status(404).json({
          success: false,
          message: "Cupo de grupo lleno",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Check if the participante exists
      const participanteCheck = await pool.query(
        "SELECT id_participante, id_sede, id_grupo FROM participante WHERE id_participante = $1",
        [id_participante],
      );

      if (participanteCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Participante no encontrado",
        });
      }

      // Check if participante belongs to the same sede as the group
      const participanteSedeId = participanteCheck.rows[0].id_sede;
      if (participanteSedeId !== groupSedeId) {
        return res.status(400).json({
          success: false,
          message:
            "El participante debe pertenecer a la misma sede que el grupo",
        });
      }

      // // Check if participante is already in a group
      // if (participanteCheck.rows[0].id_grupo !== null) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "El participante ya está asignado a un grupo",
      //   });
      // }

      // Update the participante's group
      const result = await pool.query(
        "UPDATE participante SET id_grupo = $1 WHERE id_participante = $2 RETURNING *",
        [id, id_participante],
      );

      res.status(200).json({
        success: true,
        message: "Participante asignado al grupo exitosamente",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error assigning participante to group:", error);
      res.status(500).json({
        success: false,
        message: "Error al asignar participante al grupo",
        error: error.message,
      });
    }
  },
);

// Remove a participante from a group
router.update(
  "/:id/participantes/:id_participante",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id, id_participante } = req.params;

      // Check if the group exists
      const groupCheck = await pool.query(
        "SELECT id_sede FROM grupo WHERE id_grupo = $1",
        [id],
      );

      if (groupCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Grupo no encontrado",
        });
      }

      // Check if the user has access to this group
      const groupSedeId = groupCheck.rows[0].id_sede;
      if (req.user.rol !== 0 && req.user.id_sede !== groupSedeId) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para modificar este grupo",
        });
      }

      // Update the participante's group to NULL
      const result = await pool.query(
        `UPDATE participante
       SET id_grupo = NULL
       WHERE id_participante = $1 AND id_grupo = $2
       RETURNING *`,
        [id_participante, id],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "El participante no está asignado a este grupo",
        });
      }

      res.status(200).json({
        success: true,
        message: "Participante removido del grupo exitosamente",
      });
    } catch (error) {
      console.error("Error removing participante from group:", error);
      res.status(500).json({
        success: false,
        message: "Error al remover participante del grupo",
        error: error.message,
      });
    }
  },
);

export default router;
