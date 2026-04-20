--
-- PostgreSQL database dump
--

\restrict VrkGEWJZWcmMIKtFtkfW7R1EdcxFKNN5oSY1YKiKlpiUnDTgeyzuwJukht9U8ps

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-14 17:06:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    user_id integer DEFAULT nextval('public.account_id_seq'::regclass) NOT NULL,
    email character varying(50)
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16455)
-- Name: archive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archive (
    user_id integer NOT NULL,
    "createdAt" bigint,
    "fromModel" text,
    "originalRecord" json,
    "originalRecordId" json
);


ALTER TABLE public.archive OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16451)
-- Name: archive_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archive_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archive_user_id_seq OWNER TO postgres;

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 223
-- Name: archive_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archive_user_id_seq OWNED BY public.archive.user_id;


--
-- TOC entry 226 (class 1259 OID 16454)
-- Name: block; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.block (
    id integer NOT NULL,
    blocker_id real,
    blocked_id real
);


ALTER TABLE public.block OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16452)
-- Name: block_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.block_id_seq OWNER TO postgres;

--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 224
-- Name: block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.block_id_seq OWNED BY public.block.id;


--
-- TOC entry 228 (class 1259 OID 16456)
-- Name: follower; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follower (
    id integer NOT NULL,
    follower_id real,
    followee_id real
);


ALTER TABLE public.follower OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16450)
-- Name: follower_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follower_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follower_id_seq OWNER TO postgres;

--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 222
-- Name: follower_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follower_id_seq OWNED BY public.follower.id;


--
-- TOC entry 225 (class 1259 OID 16453)
-- Name: friend; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friend (
    id integer NOT NULL,
    user_id1 real,
    user_id2 real
);


ALTER TABLE public.friend OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16449)
-- Name: friend_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friend_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friend_id_seq OWNER TO postgres;

--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 221
-- Name: friend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friend_id_seq OWNED BY public.friend.id;


--
-- TOC entry 4778 (class 2604 OID 16467)
-- Name: archive user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archive ALTER COLUMN user_id SET DEFAULT nextval('public.archive_user_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16466)
-- Name: block id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.block ALTER COLUMN id SET DEFAULT nextval('public.block_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16465)
-- Name: follower id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower ALTER COLUMN id SET DEFAULT nextval('public.follower_id_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 16468)
-- Name: friend id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend ALTER COLUMN id SET DEFAULT nextval('public.friend_id_seq'::regclass);


--
-- TOC entry 4938 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (user_id, email) FROM stdin;
1	andy@example.com
2	john@example.com
3	alice@example.com
4	bob@example.com
5	carol@example.com
\.


--
-- TOC entry 4945 (class 0 OID 16455)
-- Dependencies: 227
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archive (user_id, "createdAt", "fromModel", "originalRecord", "originalRecordId") FROM stdin;
\.


--
-- TOC entry 4944 (class 0 OID 16454)
-- Dependencies: 226
-- Data for Name: block; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.block (id, blocker_id, blocked_id) FROM stdin;
\.


--
-- TOC entry 4946 (class 0 OID 16456)
-- Dependencies: 228
-- Data for Name: follower; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follower (id, follower_id, followee_id) FROM stdin;
\.


--
-- TOC entry 4943 (class 0 OID 16453)
-- Dependencies: 225
-- Data for Name: friend; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friend (id, user_id1, user_id2) FROM stdin;
\.


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_id_seq', 5, true);


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 223
-- Name: archive_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.archive_user_id_seq', 1, false);


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 224
-- Name: block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.block_id_seq', 1, true);


--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 222
-- Name: follower_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follower_id_seq', 2, true);


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 221
-- Name: friend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friend_id_seq', 2, true);


--
-- TOC entry 4787 (class 2606 OID 16482)
-- Name: archive archive_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archive
    ADD CONSTRAINT archive_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4785 (class 2606 OID 16478)
-- Name: block block_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.block
    ADD CONSTRAINT block_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 16480)
-- Name: follower follower_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower
    ADD CONSTRAINT follower_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 16479)
-- Name: friend friend_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT friend_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16418)
-- Name: account user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


-- Completed on 2026-04-14 17:06:11

--
-- PostgreSQL database dump complete
--

\unrestrict VrkGEWJZWcmMIKtFtkfW7R1EdcxFKNN5oSY1YKiKlpiUnDTgeyzuwJukht9U8ps

