CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS places (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  place_type VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DOUBLE,
  longitude DOUBLE,
  description TEXT,
  has_ramp BOOLEAN NOT NULL DEFAULT FALSE,
  has_elevator BOOLEAN NOT NULL DEFAULT FALSE,
  has_accessible_toilet BOOLEAN NOT NULL DEFAULT FALSE,
  has_wheelchair_access BOOLEAN NOT NULL DEFAULT FALSE,
  has_accessible_parking BOOLEAN DEFAULT FALSE,
  accessibility_score INT DEFAULT 0,
  accessibility_status VARCHAR(20),
  image_url VARCHAR(255),
  created_at BIGINT,
  updated_at BIGINT
);

CREATE TABLE IF NOT EXISTS accessibility_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  place_id BIGINT,
  user_id BIGINT,
  has_ramp BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_accessible_toilet BOOLEAN DEFAULT FALSE,
  has_wheelchair_access BOOLEAN DEFAULT FALSE,
  has_accessible_parking BOOLEAN DEFAULT FALSE,
  photo_url VARCHAR(255),
  comment TEXT,
  issue_reported BOOLEAN DEFAULT FALSE,
  status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  created_at BIGINT,
  FOREIGN KEY (place_id) REFERENCES places(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
