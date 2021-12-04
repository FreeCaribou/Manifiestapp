<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211204095937 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE guest (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description_fr VARCHAR(255) DEFAULT NULL, description_nl VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE guest_category (guest_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_7966D1BE9A4AA658 (guest_id), INDEX IDX_7966D1BE12469DE2 (category_id), PRIMARY KEY(guest_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE guest_category ADD CONSTRAINT FK_7966D1BE9A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE guest_category ADD CONSTRAINT FK_7966D1BE12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE guest_category DROP FOREIGN KEY FK_7966D1BE9A4AA658');
        $this->addSql('DROP TABLE guest');
        $this->addSql('DROP TABLE guest_category');
    }
}
