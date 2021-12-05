<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

use App\Entity\Category;
use App\Entity\Guest;
use App\Entity\Place;
use App\Entity\Event;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        $eventCount = $this->getDoctrine()->getRepository(Event::class)->count([]);
        $guestCount = $this->getDoctrine()->getRepository(Guest::class)->count([]);
        $placeCount = $this->getDoctrine()->getRepository(Place::class)->count([]);
        return $this->render('admin/dashboard.html.twig', [
            'eventCount' => $eventCount,
            'guestCount' => $guestCount,
            'placeCount' => $placeCount,
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Manifiestback Admin Panel')
            ->renderContentMaximized();
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::linktoRoute('Back to the website', 'fas fa-arrow-left', 'home'),
            MenuItem::linktoDashboard('Dashboard', 'fa fa-home'),
            MenuItem::linkToCrud('Event', 'fas fa-calendar-alt', Event::class),
            MenuItem::linkToCrud('Category', 'fas fa-archive', Category::class),
            MenuItem::linkToCrud('Guest', 'fas fa-users', Guest::class),
            MenuItem::linkToCrud('Place', 'fas fa-map-marker-alt', Place::class),
        ];
    }
}
