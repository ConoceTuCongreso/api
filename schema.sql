--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 10.5

-- Started on 2018-11-27 18:37:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12982)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2868 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 16415)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2869 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 205 (class 1259 OID 16623)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name text,
    group_id integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16621)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 2870 (class 0 OID 0)
-- Dependencies: 204
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.id;


--
-- TOC entry 209 (class 1259 OID 17254)
-- Name: category_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_groups (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.category_groups OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 17252)
-- Name: category_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_groups_id_seq OWNER TO postgres;

--
-- TOC entry 2871 (class 0 OID 0)
-- Dependencies: 208
-- Name: category_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_groups_id_seq OWNED BY public.category_groups.id;


--
-- TOC entry 193 (class 1259 OID 16458)
-- Name: status_conditions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status_conditions (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.status_conditions OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16456)
-- Name: conditions_condition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conditions_condition_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conditions_condition_id_seq OWNER TO postgres;

--
-- TOC entry 2872 (class 0 OID 0)
-- Dependencies: 192
-- Name: conditions_condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conditions_condition_id_seq OWNED BY public.status_conditions.id;


--
-- TOC entry 201 (class 1259 OID 16568)
-- Name: congresspeople; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.congresspeople (
    id bigint NOT NULL,
    name text NOT NULL,
    birthdate date,
    gender "char",
    party_id bigint,
    phone text,
    email text,
    twitter text,
    facebook text,
    profile text,
    substitute text
);


ALTER TABLE public.congresspeople OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16566)
-- Name: congresspeople_congressperson_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.congresspeople_congressperson_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.congresspeople_congressperson_id_seq OWNER TO postgres;

--
-- TOC entry 2873 (class 0 OID 0)
-- Dependencies: 200
-- Name: congresspeople_congressperson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.congresspeople_congressperson_id_seq OWNED BY public.congresspeople.id;


--
-- TOC entry 188 (class 1259 OID 16428)
-- Name: initiative_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiative_status (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.initiative_status OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16537)
-- Name: initiative_status_dates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiative_status_dates (
    initiative_id bigint NOT NULL,
    status_date date NOT NULL,
    status_id integer,
    status_condition integer
);


ALTER TABLE public.initiative_status_dates OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16582)
-- Name: initiative_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiative_votes (
    value_id smallint,
    initiative_id bigint,
    congressperson_id bigint
);


ALTER TABLE public.initiative_votes OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 16441)
-- Name: initiatives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiatives (
    id bigint NOT NULL,
    description text,
    status_id integer NOT NULL,
    document_url text,
    author text,
    infolej_number text,
    agreement_number text
);


ALTER TABLE public.initiatives OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16632)
-- Name: initiatives_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiatives_categories (
    category_id bigint NOT NULL,
    initiatives_id bigint NOT NULL
);


ALTER TABLE public.initiatives_categories OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 16437)
-- Name: initiatives_initiative_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.initiatives_initiative_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.initiatives_initiative_id_seq OWNER TO postgres;

--
-- TOC entry 2874 (class 0 OID 0)
-- Dependencies: 189
-- Name: initiatives_initiative_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.initiatives_initiative_id_seq OWNED BY public.initiatives.id;


--
-- TOC entry 190 (class 1259 OID 16439)
-- Name: initiatives_status_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.initiatives_status_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.initiatives_status_seq OWNER TO postgres;

--
-- TOC entry 2875 (class 0 OID 0)
-- Dependencies: 190
-- Name: initiatives_status_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.initiatives_status_seq OWNED BY public.initiatives.status_id;


--
-- TOC entry 199 (class 1259 OID 16557)
-- Name: parties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parties (
    id bigint NOT NULL,
    name text,
    acronym character varying(16),
    logo_url text
);


ALTER TABLE public.parties OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16555)
-- Name: parties_party_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parties_party_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parties_party_id_seq OWNER TO postgres;

--
-- TOC entry 2876 (class 0 OID 0)
-- Dependencies: 198
-- Name: parties_party_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parties_party_id_seq OWNED BY public.parties.id;


--
-- TOC entry 196 (class 1259 OID 16505)
-- Name: signatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signatures (
    initiative_id bigint NOT NULL,
    "CIC" text NOT NULL,
    "OCR" text
);


ALTER TABLE public.signatures OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 16426)
-- Name: statuses_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_status_id_seq OWNER TO postgres;

--
-- TOC entry 2877 (class 0 OID 0)
-- Dependencies: 187
-- Name: statuses_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_status_id_seq OWNED BY public.initiative_status.id;


--
-- TOC entry 207 (class 1259 OID 16647)
-- Name: user_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_categories (
    category_id bigint NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.user_categories OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16605)
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    user_id uuid NOT NULL,
    initiative_id bigint NOT NULL
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 16404)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    first_name character varying(64),
    user_id uuid NOT NULL,
    username character varying(64) NOT NULL,
    middle_name character varying(64),
    last_name character varying(64),
    email text NOT NULL,
    password_salt text NOT NULL,
    password_hash text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 16469)
-- Name: vote_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vote_values (
    id smallint NOT NULL,
    name text
);


ALTER TABLE public.vote_values OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 16467)
-- Name: values_value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.values_value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.values_value_id_seq OWNER TO postgres;

--
-- TOC entry 2878 (class 0 OID 0)
-- Dependencies: 194
-- Name: values_value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.values_value_id_seq OWNED BY public.vote_values.id;


--
-- TOC entry 2694 (class 2604 OID 16799)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 2695 (class 2604 OID 17257)
-- Name: category_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_groups ALTER COLUMN id SET DEFAULT nextval('public.category_groups_id_seq'::regclass);


--
-- TOC entry 2693 (class 2604 OID 16873)
-- Name: congresspeople id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congresspeople ALTER COLUMN id SET DEFAULT nextval('public.congresspeople_congressperson_id_seq'::regclass);


--
-- TOC entry 2687 (class 2604 OID 17054)
-- Name: initiative_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_status ALTER COLUMN id SET DEFAULT nextval('public.statuses_status_id_seq'::regclass);


--
-- TOC entry 2688 (class 2604 OID 16924)
-- Name: initiatives id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives ALTER COLUMN id SET DEFAULT nextval('public.initiatives_initiative_id_seq'::regclass);


--
-- TOC entry 2689 (class 2604 OID 17184)
-- Name: initiatives status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives ALTER COLUMN status_id SET DEFAULT nextval('public.initiatives_status_seq'::regclass);


--
-- TOC entry 2692 (class 2604 OID 16961)
-- Name: parties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties ALTER COLUMN id SET DEFAULT nextval('public.parties_party_id_seq'::regclass);


--
-- TOC entry 2690 (class 2604 OID 17019)
-- Name: status_conditions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_conditions ALTER COLUMN id SET DEFAULT nextval('public.conditions_condition_id_seq'::regclass);


--
-- TOC entry 2691 (class 2604 OID 16764)
-- Name: vote_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_values ALTER COLUMN id SET DEFAULT nextval('public.values_value_id_seq'::regclass);


--
-- TOC entry 2720 (class 2606 OID 16801)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2726 (class 2606 OID 17262)
-- Name: category_groups category_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_groups
    ADD CONSTRAINT category_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 2708 (class 2606 OID 17021)
-- Name: status_conditions conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_conditions
    ADD CONSTRAINT conditions_pkey PRIMARY KEY (id);


--
-- TOC entry 2716 (class 2606 OID 16875)
-- Name: congresspeople congresspeople_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congresspeople
    ADD CONSTRAINT congresspeople_pkey PRIMARY KEY (id);


--
-- TOC entry 2718 (class 2606 OID 16609)
-- Name: user_favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (initiative_id, user_id);


--
-- TOC entry 2722 (class 2606 OID 16636)
-- Name: initiatives_categories initiatives_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives_categories
    ADD CONSTRAINT initiatives_categories_pkey PRIMARY KEY (category_id, initiatives_id);


--
-- TOC entry 2704 (class 2606 OID 16663)
-- Name: initiatives initiatives_infolej_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_infolej_num_key UNIQUE (infolej_number);


--
-- TOC entry 2706 (class 2606 OID 16926)
-- Name: initiatives initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_pkey PRIMARY KEY (id);


--
-- TOC entry 2714 (class 2606 OID 16963)
-- Name: parties parties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_pkey PRIMARY KEY (id);


--
-- TOC entry 2712 (class 2606 OID 17251)
-- Name: signatures signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_pkey PRIMARY KEY (initiative_id, "CIC");


--
-- TOC entry 2702 (class 2606 OID 17056)
-- Name: initiative_status statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_status
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 2724 (class 2606 OID 16651)
-- Name: user_categories user_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_pkey PRIMARY KEY (category_id, user_id);


--
-- TOC entry 2698 (class 2606 OID 16413)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2700 (class 2606 OID 16411)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2710 (class 2606 OID 16766)
-- Name: vote_values values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_values
    ADD CONSTRAINT values_pkey PRIMARY KEY (id);


--
-- TOC entry 2696 (class 1259 OID 16414)
-- Name: emails; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX emails ON public.users USING btree (email);


--
-- TOC entry 2738 (class 2606 OID 17263)
-- Name: categories categories_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.category_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2732 (class 2606 OID 17238)
-- Name: congresspeople congresspeople_party_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.congresspeople
    ADD CONSTRAINT congresspeople_party_fkey FOREIGN KEY (party_id) REFERENCES public.parties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2731 (class 2606 OID 17022)
-- Name: initiative_status_dates dates_conditions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_status_dates
    ADD CONSTRAINT dates_conditions_fkey FOREIGN KEY (status_condition) REFERENCES public.status_conditions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2729 (class 2606 OID 17082)
-- Name: initiative_status_dates dates_initiative_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_status_dates
    ADD CONSTRAINT dates_initiative_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2730 (class 2606 OID 17175)
-- Name: initiative_status_dates dates_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_status_dates
    ADD CONSTRAINT dates_status_fkey FOREIGN KEY (status_id) REFERENCES public.initiative_status(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2737 (class 2606 OID 16937)
-- Name: user_favorites favorites_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT favorites_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2736 (class 2606 OID 16610)
-- Name: user_favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2739 (class 2606 OID 16802)
-- Name: initiatives_categories initiatives_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives_categories
    ADD CONSTRAINT initiatives_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2740 (class 2606 OID 16942)
-- Name: initiatives_categories initiatives_categories_initiatives_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives_categories
    ADD CONSTRAINT initiatives_categories_initiatives_id_fkey FOREIGN KEY (initiatives_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2728 (class 2606 OID 16992)
-- Name: signatures signatures_initiative_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_initiative_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2727 (class 2606 OID 17185)
-- Name: initiatives status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT status FOREIGN KEY (status_id) REFERENCES public.initiative_status(id);


--
-- TOC entry 2742 (class 2606 OID 16807)
-- Name: user_categories user_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2741 (class 2606 OID 16657)
-- Name: user_categories user_categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_categories
    ADD CONSTRAINT user_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2733 (class 2606 OID 17206)
-- Name: initiative_votes votes_congressperson_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_votes
    ADD CONSTRAINT votes_congressperson_fkey FOREIGN KEY (congressperson_id) REFERENCES public.congresspeople(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2734 (class 2606 OID 17222)
-- Name: initiative_votes votes_initiative_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_votes
    ADD CONSTRAINT votes_initiative_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2735 (class 2606 OID 17230)
-- Name: initiative_votes votes_value_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_votes
    ADD CONSTRAINT votes_value_id_fkey FOREIGN KEY (value_id) REFERENCES public.vote_values(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2867 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2018-11-27 18:38:11

--
-- PostgreSQL database dump complete
--
