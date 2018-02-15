CREATE TABLE pucks (
    id integer NOT NULL,
    name text,
    estimote_id text,
    beacon_uuid text,
    beacon_major_val integer,
    beacon_minor_val integer,
    lat double precision,
    lng double precision
);

CREATE SEQUENCE pucks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE pucks_id_seq OWNED BY pucks.id;

ALTER TABLE ONLY pucks ALTER COLUMN id SET DEFAULT nextval('pucks_id_seq'::regclass);

COPY pucks (id, name, estimote_id, beacon_uuid, beacon_major_val, beacon_minor_val, lat, lng) FROM stdin;
1	Test1	mock1	548D0A1E-9443-4253-ADF5-C5BB55903CC6	1	1	30.267153	-97.743061
2	Test2	mock2	87662669-434E-4C9E-BF70-BDCD2BD71884	3	3	30.265888	-97.742057
3	Test3	mock3	9BAC3C30-34CE-4628-B068-016224B7D9F3	2	2	30.266666	-97.745748
4	Test4	mock4	EADA65DC-5BD1-4501-9DC5-E69D2FF89BD2	4	4	30.265739	-97.745275
\.

SELECT pg_catalog.setval('pucks_id_seq', 4, true);

ALTER TABLE ONLY pucks
    ADD CONSTRAINT pucks_pkey PRIMARY KEY (id);