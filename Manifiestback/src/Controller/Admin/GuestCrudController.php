<?php

namespace App\Controller\Admin;

use App\Entity\Guest;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

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
            TextField::new('description_fr'),
            TextField::new('description_nl'),
            AssociationField::new('categories')->onlyOnForms(),
            TextField::new('categoriesToString', 'Categories')->hideOnForm(),
        ];
    }
}
