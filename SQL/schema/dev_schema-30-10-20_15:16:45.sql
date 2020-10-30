--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: item_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.item_subscriptions (
    chat_id integer NOT NULL,
    item character varying(25) NOT NULL
);


--
-- Name: service_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_subscriptions (
    chat_id integer NOT NULL,
    service character varying(25) NOT NULL
);


--
-- Name: item_subscriptions item_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_subscriptions
    ADD CONSTRAINT item_subscriptions_pkey PRIMARY KEY (chat_id, item);


--
-- Name: service_subscriptions service_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_subscriptions
    ADD CONSTRAINT service_subscriptions_pkey PRIMARY KEY (service, chat_id);


--
-- Name: TABLE item_subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.item_subscriptions TO tradedrop_bot;


--
-- Name: TABLE service_subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.service_subscriptions TO tradedrop_bot;


--
-- PostgreSQL database dump complete
--

