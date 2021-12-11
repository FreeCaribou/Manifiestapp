<?php

namespace App\Controller\Admin;

use App\Entity\Guest;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;

class GuestCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Guest::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name'),
            TextareaField::new('description_fr'),
            TextareaField::new('description_nl'),
            AssociationField::new('categories')->onlyOnForms(),
            TextField::new('categoriesToString', 'Categories')->hideOnForm(),
            ImageField::new('picture')->setUploadDir('/public/images/guests')->setUploadedFileNamePattern("images/guests/[name].[extension]"),
        ];
    }
}
