--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: check_group_capacity(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_group_capacity(p_id_grupo integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    group_capacity INTEGER;
    current_participants INTEGER;
BEGIN
     -- Get the capacity of the group
    SELECT cupo
    INTO group_capacity
    FROM grupo -- Assuming 'grupo' table has 'id_grupo' and 'cupo'
    WHERE id_grupo = p_id_grupo;


     -- Get the current participants in the group
     SELECT current_cupo
     INTO current_participants
     FROM grupo -- Assuming 'grupo' table has 'id_grupo' and 'cupo'
     WHERE id_grupo = p_id_grupo;

    IF group_capacity > current_participants THEN
        RETURN  true;
    END IF;

    -- Check if there is space
    RETURN  false;
END;
$$;


ALTER FUNCTION public.check_group_capacity(p_id_grupo integer) OWNER TO postgres;

--
-- Name: check_sede_capacity(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_sede_capacity(participante_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    sede_id INTEGER;
    available_slots INTEGER;
BEGIN
    -- Get the sede_id from the participante table
    SELECT id_sede INTO sede_id
    FROM participante
    WHERE id_participante = participante_id;

    -- If no sede found for this participante, return false
    IF sede_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check available slots in the sede
    SELECT lugares_disponibles INTO available_slots
    FROM sede_capacity
    WHERE id_sede = sede_id;

    RETURN COALESCE(available_slots, 0) > 0;
END;
$$;


ALTER FUNCTION public.check_sede_capacity(participante_id integer) OWNER TO postgres;

--
-- Name: registro_participante_con_tutor(character varying, character varying, character varying, integer, character varying, character varying, character varying, character varying, character varying, integer, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.registro_participante_con_tutor(IN p_nombre_participante character varying, IN p_apellido_paterno_participante character varying, IN p_apellido_materno_participante character varying, IN p_edad integer, IN p_correo_participante character varying, IN p_escuela character varying, IN p_escolaridad character varying, IN p_permiso character varying, IN p_idioma character varying, IN p_id_sede integer, IN p_nombre_tutor character varying, IN p_apellido_paterno_tutor character varying, IN p_apellido_materno_tutor character varying, IN p_correo_tutor character varying, IN p_telefono_tutor character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_tutor INTEGER;
BEGIN
    -- Insertar padre o tutor y obtener su ID
    INSERT INTO padre_o_tutor (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono
    ) VALUES (
        p_nombre_tutor,
        p_apellido_paterno_tutor,
        p_apellido_materno_tutor,
        p_correo_tutor,
        p_telefono_tutor
    ) RETURNING id_padre_o_tutor INTO v_id_tutor;

    -- Insertar participante con el ID del tutor
    INSERT INTO participante (
        nombre,
        apellido_paterno,
        apellido_materno,
        edad,
        correo,
        id_padre_o_tutor,
        id_sede,
        escuela,
        escolaridad,
        permiso_padre_tutor,
        idioma,
        estado
    ) VALUES (
        p_nombre_participante,
        p_apellido_paterno_participante,
        p_apellido_materno_participante,
        p_edad,
        p_correo_participante,
        v_id_tutor,
        p_id_sede, -- Use the retrieved sede ID
        p_escuela,
        p_escolaridad,
        p_permiso,
        p_idioma,
        'Pendiente'
    );
END;
$$;


ALTER PROCEDURE public.registro_participante_con_tutor(IN p_nombre_participante character varying, IN p_apellido_paterno_participante character varying, IN p_apellido_materno_participante character varying, IN p_edad integer, IN p_correo_participante character varying, IN p_escuela character varying, IN p_escolaridad character varying, IN p_permiso character varying, IN p_idioma character varying, IN p_id_sede integer, IN p_nombre_tutor character varying, IN p_apellido_paterno_tutor character varying, IN p_apellido_materno_tutor character varying, IN p_correo_tutor character varying, IN p_telefono_tutor character varying) OWNER TO postgres;

--
-- Name: registro_sede_con_coordinadora(character varying, character varying, character varying, character varying, character varying, character varying, date, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.registro_sede_con_coordinadora(IN p_nombre_coordinadora character varying, IN p_apellido_paterno_coordinadora character varying, IN p_apellido_materno_coordinadora character varying, IN p_correo_coordinadora character varying, IN "p_contraseña" character varying, IN p_nombre_sede character varying, IN p_fecha_inicio date, IN p_convocatoria character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_coordinadora INTEGER;
BEGIN
    -- Insertar coordinadora y obtener su ID
    INSERT INTO coordinadora (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contraseña,
        rol
    ) VALUES (
        p_nombre_coordinadora,
        p_apellido_paterno_coordinadora,
        p_apellido_materno_coordinadora,
        p_correo_coordinadora,
        p_contraseña,
        1
    ) RETURNING id_coordinadora INTO v_id_coordinadora;

    -- Insertar sede con el ID de la coordinadora
    INSERT INTO sede (
        nombre,
        convocatoria,
        fecha_inicio,
        estado,
        id_coordinadora
    ) VALUES (
        p_nombre_sede,
        p_convocatoria,
        p_fecha_inicio,
        'Pendiente',
        v_id_coordinadora  -- ID de la coordinadora
    );
END;
$$;


ALTER PROCEDURE public.registro_sede_con_coordinadora(IN p_nombre_coordinadora character varying, IN p_apellido_paterno_coordinadora character varying, IN p_apellido_materno_coordinadora character varying, IN p_correo_coordinadora character varying, IN "p_contraseña" character varying, IN p_nombre_sede character varying, IN p_fecha_inicio date, IN p_convocatoria character varying) OWNER TO postgres;

--
-- Name: trg_update_grupo_current_cupo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_update_grupo_current_cupo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Action for INSERT operations
    IF (TG_OP = 'INSERT') THEN
        IF NEW.id_grupo IS NOT NULL THEN
            UPDATE grupo
            SET current_cupo = COALESCE(current_cupo, 0) + 1
            WHERE id_grupo = NEW.id_grupo;
        END IF;
    END IF;

    -- Action for UPDATE operations
    IF (TG_OP = 'UPDATE') THEN
        -- Check if id_grupo actually changed to avoid unnecessary updates
        IF NEW.id_grupo IS DISTINCT FROM OLD.id_grupo THEN
            -- Decrement current_cupo for the old group, if it existed
            IF OLD.id_grupo IS NOT NULL THEN
                UPDATE grupo
                SET current_cupo = GREATEST(current_cupo - 1,0)
                WHERE id_grupo = OLD.id_grupo;
            END IF;

            -- Increment current_cupo for the new group, if it's assigned
            IF NEW.id_grupo IS NOT NULL THEN
                UPDATE grupo
                SET current_cupo = COALESCE(current_cupo, 0) + 1
                WHERE id_grupo = NEW.id_grupo;
            END IF;
        END IF;
    END IF;

    RETURN NEW; -- For INSERT/UPDATE triggers, NEW should be returned
END;
$$;


ALTER FUNCTION public.trg_update_grupo_current_cupo() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: colaborador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colaborador (
    id_colaborador integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100) NOT NULL,
    universidad character varying(50) NOT NULL,
    idioma character varying(50) NOT NULL,
    id_sede integer,
    nivel character varying(50) NOT NULL,
    id_grupo integer,
    carrera character varying(50) NOT NULL,
    rol character varying(50) NOT NULL,
    estado character varying(50) NOT NULL
);


ALTER TABLE public.colaborador OWNER TO postgres;

--
-- Name: colaborador_id_colaborador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colaborador_id_colaborador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colaborador_id_colaborador_seq OWNER TO postgres;

--
-- Name: colaborador_id_colaborador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colaborador_id_colaborador_seq OWNED BY public.colaborador.id_colaborador;


--
-- Name: coordinadora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coordinadora (
    id_coordinadora integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    rol integer
);


ALTER TABLE public.coordinadora OWNER TO postgres;

--
-- Name: coordinadora_asociada; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coordinadora_asociada (
    id_coordinadora_asociada integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100) NOT NULL,
    id_sede integer,
    estado character varying
);


ALTER TABLE public.coordinadora_asociada OWNER TO postgres;

--
-- Name: coordinadora_asociada_id_coordinadora_asociada_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coordinadora_asociada_id_coordinadora_asociada_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coordinadora_asociada_id_coordinadora_asociada_seq OWNER TO postgres;

--
-- Name: coordinadora_asociada_id_coordinadora_asociada_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coordinadora_asociada_id_coordinadora_asociada_seq OWNED BY public.coordinadora_asociada.id_coordinadora_asociada;


--
-- Name: coordinadora_id_coordinadora_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coordinadora_id_coordinadora_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coordinadora_id_coordinadora_seq OWNER TO postgres;

--
-- Name: coordinadora_id_coordinadora_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coordinadora_id_coordinadora_seq OWNED BY public.coordinadora.id_coordinadora;


--
-- Name: grupo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grupo (
    id_grupo integer NOT NULL,
    id_sede integer,
    idioma character varying(50) NOT NULL,
    nivel character varying(50) NOT NULL,
    cupo integer,
    current_cupo integer
);


ALTER TABLE public.grupo OWNER TO postgres;

--
-- Name: grupo_id_grupo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grupo_id_grupo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grupo_id_grupo_seq OWNER TO postgres;

--
-- Name: grupo_id_grupo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grupo_id_grupo_seq OWNED BY public.grupo.id_grupo;


--
-- Name: informante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.informante (
    id_informante integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100),
    id_sede integer NOT NULL
);


ALTER TABLE public.informante OWNER TO postgres;

--
-- Name: informante_id_informante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.informante_id_informante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.informante_id_informante_seq OWNER TO postgres;

--
-- Name: informante_id_informante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.informante_id_informante_seq OWNED BY public.informante.id_informante;


--
-- Name: mentora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentora (
    id_mentora integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100) NOT NULL,
    id_sede integer,
    estado character varying
);


ALTER TABLE public.mentora OWNER TO postgres;

--
-- Name: mentora_grupo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentora_grupo (
    id_mentora_grupo integer NOT NULL,
    id_mentora integer,
    id_grupo integer
);


ALTER TABLE public.mentora_grupo OWNER TO postgres;

--
-- Name: mentora_grupo_id_mentora_grupo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentora_grupo_id_mentora_grupo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentora_grupo_id_mentora_grupo_seq OWNER TO postgres;

--
-- Name: mentora_grupo_id_mentora_grupo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mentora_grupo_id_mentora_grupo_seq OWNED BY public.mentora_grupo.id_mentora_grupo;


--
-- Name: mentora_id_personal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentora_id_personal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentora_id_personal_seq OWNER TO postgres;

--
-- Name: mentora_id_personal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mentora_id_personal_seq OWNED BY public.mentora.id_mentora;


--
-- Name: padre_o_tutor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.padre_o_tutor (
    id_padre_o_tutor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    correo character varying(100) NOT NULL,
    telefono character varying(50) NOT NULL
);


ALTER TABLE public.padre_o_tutor OWNER TO postgres;

--
-- Name: padre_o_tutor_id_padre_o_tutor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.padre_o_tutor_id_padre_o_tutor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.padre_o_tutor_id_padre_o_tutor_seq OWNER TO postgres;

--
-- Name: padre_o_tutor_id_padre_o_tutor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.padre_o_tutor_id_padre_o_tutor_seq OWNED BY public.padre_o_tutor.id_padre_o_tutor;


--
-- Name: participante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participante (
    id_participante integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    edad integer,
    correo character varying(100) NOT NULL,
    id_padre_o_tutor integer,
    id_grupo integer,
    id_sede integer,
    escuela character varying(50) NOT NULL,
    escolaridad character varying(50) NOT NULL,
    permiso_padre_tutor character varying(255),
    idioma character varying(50) NOT NULL,
    estado character varying(50)
);


ALTER TABLE public.participante OWNER TO postgres;

--
-- Name: participante_id_participante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participante_id_participante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participante_id_participante_seq OWNER TO postgres;

--
-- Name: participante_id_participante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participante_id_participante_seq OWNED BY public.participante.id_participante;


--
-- Name: sede; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sede (
    id_sede integer NOT NULL,
    id_coordinadora integer,
    nombre character varying(100) NOT NULL,
    convocatoria character varying(255),
    fecha_inicio date,
    estado character varying(15)
);


ALTER TABLE public.sede OWNER TO postgres;

--
-- Name: sede_capacity; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sede_capacity AS
 SELECT s.id_sede,
    s.nombre AS nombre_sede,
    sum(g.cupo) AS capacidad_total,
    sum(g.current_cupo) AS participantes_actuales,
    (sum(g.cupo) - sum(g.current_cupo)) AS lugares_disponibles
   FROM ((public.sede s
     LEFT JOIN public.grupo g ON ((s.id_sede = g.id_sede)))
     LEFT JOIN public.participante p ON (((s.id_sede = p.id_sede) AND ((p.estado)::text = 'Activo'::text))))
  GROUP BY s.id_sede, s.nombre;


ALTER VIEW public.sede_capacity OWNER TO postgres;

--
-- Name: sede_id_sede_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sede_id_sede_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sede_id_sede_seq OWNER TO postgres;

--
-- Name: sede_id_sede_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sede_id_sede_seq OWNED BY public.sede.id_sede;


--
-- Name: v_id_sede; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.v_id_sede (
    id_sede integer
);


ALTER TABLE public.v_id_sede OWNER TO postgres;

--
-- Name: colaborador id_colaborador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador ALTER COLUMN id_colaborador SET DEFAULT nextval('public.colaborador_id_colaborador_seq'::regclass);


--
-- Name: coordinadora id_coordinadora; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora ALTER COLUMN id_coordinadora SET DEFAULT nextval('public.coordinadora_id_coordinadora_seq'::regclass);


--
-- Name: coordinadora_asociada id_coordinadora_asociada; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora_asociada ALTER COLUMN id_coordinadora_asociada SET DEFAULT nextval('public.coordinadora_asociada_id_coordinadora_asociada_seq'::regclass);


--
-- Name: grupo id_grupo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo ALTER COLUMN id_grupo SET DEFAULT nextval('public.grupo_id_grupo_seq'::regclass);


--
-- Name: informante id_informante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informante ALTER COLUMN id_informante SET DEFAULT nextval('public.informante_id_informante_seq'::regclass);


--
-- Name: mentora id_mentora; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora ALTER COLUMN id_mentora SET DEFAULT nextval('public.mentora_id_personal_seq'::regclass);


--
-- Name: mentora_grupo id_mentora_grupo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora_grupo ALTER COLUMN id_mentora_grupo SET DEFAULT nextval('public.mentora_grupo_id_mentora_grupo_seq'::regclass);


--
-- Name: padre_o_tutor id_padre_o_tutor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padre_o_tutor ALTER COLUMN id_padre_o_tutor SET DEFAULT nextval('public.padre_o_tutor_id_padre_o_tutor_seq'::regclass);


--
-- Name: participante id_participante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante ALTER COLUMN id_participante SET DEFAULT nextval('public.participante_id_participante_seq'::regclass);


--
-- Name: sede id_sede; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede ALTER COLUMN id_sede SET DEFAULT nextval('public.sede_id_sede_seq'::regclass);


--
-- Name: colaborador colaborador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador
    ADD CONSTRAINT colaborador_pkey PRIMARY KEY (id_colaborador);


--
-- Name: coordinadora_asociada coordinadora_asociada_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora_asociada
    ADD CONSTRAINT coordinadora_asociada_pkey PRIMARY KEY (id_coordinadora_asociada);


--
-- Name: coordinadora coordinadora_correo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora
    ADD CONSTRAINT coordinadora_correo_unique UNIQUE (correo);


--
-- Name: coordinadora coordinadora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora
    ADD CONSTRAINT coordinadora_pkey PRIMARY KEY (id_coordinadora);


--
-- Name: grupo grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id_grupo);


--
-- Name: informante informante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informante
    ADD CONSTRAINT informante_pkey PRIMARY KEY (id_informante);


--
-- Name: mentora_grupo mentora_grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora_grupo
    ADD CONSTRAINT mentora_grupo_pkey PRIMARY KEY (id_mentora_grupo);


--
-- Name: mentora mentora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora
    ADD CONSTRAINT mentora_pkey PRIMARY KEY (id_mentora);


--
-- Name: padre_o_tutor padre_o_tutor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.padre_o_tutor
    ADD CONSTRAINT padre_o_tutor_pkey PRIMARY KEY (id_padre_o_tutor);


--
-- Name: participante participante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante
    ADD CONSTRAINT participante_pkey PRIMARY KEY (id_participante);


--
-- Name: sede sede_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede
    ADD CONSTRAINT sede_pkey PRIMARY KEY (id_sede);


--
-- Name: participante trg_participante_id_grupo_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_participante_id_grupo_change AFTER INSERT OR UPDATE OF id_grupo ON public.participante FOR EACH ROW EXECUTE FUNCTION public.trg_update_grupo_current_cupo();


--
-- Name: colaborador colaborador_id_grupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador
    ADD CONSTRAINT colaborador_id_grupo_fkey FOREIGN KEY (id_grupo) REFERENCES public.grupo(id_grupo);


--
-- Name: colaborador colaborador_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador
    ADD CONSTRAINT colaborador_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: coordinadora_asociada coordinadora_asociada_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coordinadora_asociada
    ADD CONSTRAINT coordinadora_asociada_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: grupo grupo_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo
    ADD CONSTRAINT grupo_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: informante informante_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informante
    ADD CONSTRAINT informante_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: mentora_grupo mentora_grupo_id_grupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora_grupo
    ADD CONSTRAINT mentora_grupo_id_grupo_fkey FOREIGN KEY (id_grupo) REFERENCES public.grupo(id_grupo);


--
-- Name: mentora_grupo mentora_grupo_id_mentora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora_grupo
    ADD CONSTRAINT mentora_grupo_id_mentora_fkey FOREIGN KEY (id_mentora) REFERENCES public.mentora(id_mentora);


--
-- Name: mentora mentora_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentora
    ADD CONSTRAINT mentora_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: participante participante_id_grupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante
    ADD CONSTRAINT participante_id_grupo_fkey FOREIGN KEY (id_grupo) REFERENCES public.grupo(id_grupo);


--
-- Name: participante participante_id_padre_o_tutor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante
    ADD CONSTRAINT participante_id_padre_o_tutor_fkey FOREIGN KEY (id_padre_o_tutor) REFERENCES public.padre_o_tutor(id_padre_o_tutor);


--
-- Name: participante participante_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participante
    ADD CONSTRAINT participante_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sede(id_sede);


--
-- Name: sede sede_id_coordinadora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede
    ADD CONSTRAINT sede_id_coordinadora_fkey FOREIGN KEY (id_coordinadora) REFERENCES public.coordinadora(id_coordinadora);


--
-- PostgreSQL database dump complete
--
