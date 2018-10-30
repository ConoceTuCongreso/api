-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    first_name character varying(64) COLLATE pg_catalog."default",
    user_id uuid NOT NULL,
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    middle_name character varying(64) COLLATE pg_catalog."default",
    last_name character varying(64) COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    password_salt text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

-- Index: emails

-- DROP INDEX public.emails;

CREATE UNIQUE INDEX emails
    ON public.users USING btree
    (email COLLATE pg_catalog."default")
    TABLESPACE pg_default;