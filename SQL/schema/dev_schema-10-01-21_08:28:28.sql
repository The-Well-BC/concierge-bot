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
    item character varying(25) NOT NULL,
    messenger character varying DEFAULT 'telegram'::character varying NOT NULL
);


--
-- Name: service_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_subscriptions (
    chat_id character varying NOT NULL,
    messenger character varying DEFAULT 'telegram'::character varying NOT NULL
);


--
-- Name: subscription_filters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_filters (
    _id integer NOT NULL,
    data jsonb NOT NULL,
    chat_id character varying NOT NULL,
    messenger character varying NOT NULL
);


--
-- Name: subscription_filters__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_filters__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_filters__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_filters__id_seq OWNED BY public.subscription_filters._id;


--
-- Name: subscription_filters _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_filters ALTER COLUMN _id SET DEFAULT nextval('public.subscription_filters__id_seq'::regclass);


--
-- Name: item_subscriptions item_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_subscriptions
    ADD CONSTRAINT item_subscriptions_pkey PRIMARY KEY (chat_id, item);


--
-- Name: service_subscriptions service_subscriptions_chat_id_messenger_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_subscriptions
    ADD CONSTRAINT service_subscriptions_chat_id_messenger_key UNIQUE (chat_id, messenger);


--
-- Name: service_subscriptions service_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_subscriptions
    ADD CONSTRAINT service_subscriptions_pkey PRIMARY KEY (chat_id, messenger);


--
-- Name: subscription_filters subscription_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_filters
    ADD CONSTRAINT subscription_filters_pkey PRIMARY KEY (_id, chat_id, messenger);


--
-- Name: subscription_filters subscription_filters_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_filters
    ADD CONSTRAINT subscription_filters_chat_id_fkey FOREIGN KEY (chat_id, messenger) REFERENCES public.service_subscriptions(chat_id, messenger) ON DELETE CASCADE;


--
-- Name: TABLE item_subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.item_subscriptions TO tradedrop_bot;


--
-- Name: TABLE service_subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.service_subscriptions TO tradedrop_bot;


--
-- Name: TABLE subscription_filters; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.subscription_filters TO tradedrop_bot;


--
-- Name: SEQUENCE subscription_filters__id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.subscription_filters__id_seq TO tradedrop_bot;


--
-- PostgreSQL database dump complete
--

