import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1741209454481 implements MigrationInterface {
    name = 'InitialMigration1741209454481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isFirstLogin\` tinyint NOT NULL DEFAULT 0, \`refreshTokens\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_permissions_permission\` (\`rolesId\` varchar(36) NOT NULL, \`permissionId\` varchar(255) NOT NULL, INDEX \`IDX_a740421f76d0df27723db697ae\` (\`rolesId\`), INDEX \`IDX_ea2b57117f371a484bc086819a\` (\`permissionId\`), PRIMARY KEY (\`rolesId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_roles_roles\` (\`usersId\` varchar(36) NOT NULL, \`rolesId\` varchar(36) NOT NULL, INDEX \`IDX_df951a64f09865171d2d7a502b\` (\`usersId\`), INDEX \`IDX_b2f0366aa9349789527e0c36d9\` (\`rolesId\`), PRIMARY KEY (\`usersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_direct_permissions_permission\` (\`usersId\` varchar(36) NOT NULL, \`permissionId\` varchar(255) NOT NULL, INDEX \`IDX_c5b624ca98bef62847582737d8\` (\`usersId\`), INDEX \`IDX_a8f68feda1fc56ddb2fedac7c1\` (\`permissionId\`), PRIMARY KEY (\`usersId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` ADD CONSTRAINT \`FK_a740421f76d0df27723db697ae9\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` ADD CONSTRAINT \`FK_ea2b57117f371a484bc086819a8\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_df951a64f09865171d2d7a502b1\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_b2f0366aa9349789527e0c36d97\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_direct_permissions_permission\` ADD CONSTRAINT \`FK_c5b624ca98bef62847582737d8b\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_direct_permissions_permission\` ADD CONSTRAINT \`FK_a8f68feda1fc56ddb2fedac7c12\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_direct_permissions_permission\` DROP FOREIGN KEY \`FK_a8f68feda1fc56ddb2fedac7c12\``);
        await queryRunner.query(`ALTER TABLE \`users_direct_permissions_permission\` DROP FOREIGN KEY \`FK_c5b624ca98bef62847582737d8b\``);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_b2f0366aa9349789527e0c36d97\``);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_df951a64f09865171d2d7a502b1\``);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` DROP FOREIGN KEY \`FK_ea2b57117f371a484bc086819a8\``);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` DROP FOREIGN KEY \`FK_a740421f76d0df27723db697ae9\``);
        await queryRunner.query(`DROP INDEX \`IDX_a8f68feda1fc56ddb2fedac7c1\` ON \`users_direct_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_c5b624ca98bef62847582737d8\` ON \`users_direct_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`users_direct_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_b2f0366aa9349789527e0c36d9\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_df951a64f09865171d2d7a502b\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_ea2b57117f371a484bc086819a\` ON \`roles_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_a740421f76d0df27723db697ae\` ON \`roles_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`roles_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
