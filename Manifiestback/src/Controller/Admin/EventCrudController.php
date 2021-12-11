<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;

class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('title_fr'),
            TextField::new('title_nl'),
            AssociationField::new('place')->onlyOnForms(),
            AssociationField::new('categories')->onlyOnForms(),
            AssociationField::new('guests')->onlyOnForms(),
            TextEditorField::new('description_fr'),
            TextEditorField::new('description_nl'),
            ImageField::new('picture')->setUploadDir('/public/images/events')->setUploadedFileNamePattern("images/events/[name].[extension]"),

            TextField::new('placeToString', 'Place')->hideOnForm(),
            TextField::new('categoriesToString', 'Categories')->hideOnForm(),
            TextField::new('guestsToString', 'Guest')->hideOnForm(),
        ];
    }
}
