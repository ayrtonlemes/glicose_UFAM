-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema glicose
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema glicose
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `glicose` DEFAULT CHARACTER SET utf8mb4 ;
USE `glicose` ;

-- -----------------------------------------------------
-- Table `glicose`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`patient` (
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  `age` TINYINT(3) NULL DEFAULT NULL,
  `gender` ENUM('MALE', 'FEMALE') NULL DEFAULT NULL,
  PRIMARY KEY (`id_patient`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`acc_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`acc_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `acc_x` DOUBLE NULL DEFAULT NULL,
  `acc_y` DOUBLE NULL DEFAULT NULL,
  `acc_z` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `acc_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`bvp_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`bvp_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `bvp` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `bvp_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`eda_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`eda_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `eda` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `eda_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 241544
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`food_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`food_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `registro_date` DATE NOT NULL,
  `registro_time` TIME NOT NULL,
  `time_begin` DATETIME NULL DEFAULT NULL,
  `time_end` TIME NULL DEFAULT NULL,
  `logged_food` TEXT NULL DEFAULT NULL,
  `calorie` FLOAT NULL DEFAULT NULL,
  `carbo` FLOAT NULL DEFAULT NULL,
  `sugar` FLOAT NULL DEFAULT NULL,
  `protein` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `food_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`glicodex_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`glicodex_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `value_gluco` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `glicodex_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 2562
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`hr_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`hr_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `hr` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `hr_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`ibi_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`ibi_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `ibi` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `ibi_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 266367
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `glicose`.`temp_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `glicose`.`temp_data` (
  `id_sec_data` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_patient` INT(10) UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `temp` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id_sec_data`, `id_patient`),
  INDEX `id_patient` (`id_patient` ASC) VISIBLE,
  CONSTRAINT `temp_data_ibfk_1`
    FOREIGN KEY (`id_patient`)
    REFERENCES `glicose`.`patient` (`id_patient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
