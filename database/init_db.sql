DROP TABLE IF EXISTS "trip" CASCADE;
DROP TABLE IF EXISTS "flight" CASCADE;
DROP TABLE IF EXISTS "plane" CASCADE;
DROP TABLE IF EXISTS "passenger" CASCADE;
DROP TABLE IF EXISTS "pilot" CASCADE;
DROP TABLE IF EXISTS "airport" CASCADE;


CREATE TABLE IF NOT EXISTS "plane" (
  pid SERIAL PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  noBusinessSeats INTEGER NOT NULL,
  noEconomySeats INTEGER NOT NULL,
  carryOnCapacity INTEGER NOT NULL,
  checkInCapacity INTEGER NOT NULL,
  maxWeight INTEGER NOT NULL,
  range INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "passenger" (
  cid SERIAL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL 
);

CREATE TABLE IF NOT EXISTS "pilot" (
  pilotID SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "airport" (
  aid SERIAL PRIMARY KEY,
  aname VARCHAR(50) UNIQUE NOT NULL,
  city VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL, 
  numGates INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "flight" (
  fid SERIAL PRIMARY KEY,
  pid INTEGER NOT NULL REFERENCES "plane",
  pilotID INTEGER NOT NULL REFERENCES "pilot",
  startAid INTEGER NOT NULL REFERENCES "airport",
  destinationAid INTEGER NOT NULL REFERENCES "airport",
  departureGate INTEGER NOT NULL,
  arrivalGate INTEGER NOT NULL,
  departureDate TIMESTAMP NOT NULL, 
  arrivalDate TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "trip" (
  tid SERIAL PRIMARY KEY,
  fid INTEGER NOT NULL REFERENCES "flight",
  cid INTEGER NOT NULL REFERENCES "passenger",
  ticketPrice INTEGER NOT NULL,
  timeCreated TIMESTAMP DEFAULT NOW()
);
