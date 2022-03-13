<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use App\Repository\CategoryRepository;
use App\Repository\GuestRepository;
use App\Repository\PlaceRepository;
use App\Repository\EventRepository;
use Symfony\Component\Serializer\SerializerInterface;
use Twig\Environment;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
  /**
   * @Route("/", name="home-no-locale")
   */
  public function indexNoLocale(): Response
  {
    return $this->redirectToRoute('home', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/", name="home")
   */
  public function index(Environment $twig, GuestRepository $repo, Request $request): Response
  {
    return new Response($twig->render('home/index.html.twig', [
      'guests' => $repo->findAllWithTrans($request),
    ]));
  }

  /**
   * @Route("/events", name="events-no-locale")
   */
  public function eventsNoLocale(): Response
  {
    return $this->redirectToRoute('events', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/events", name="events")
   */
  public function events(Environment $twig, EventRepository $repo, Request $request): Response
  {
    return new Response($twig->render('event/events.html.twig', [
      'events' => $repo->findAllWithTrans($request),
    ]));
  }

  /**
   * @Route("/event/{id}", name="event-no-locale")
   */
  public function eventNoLocale(string $id): Response
  {
    return $this->redirectToRoute('event', ['_locale' => 'fr', 'id' => $id]);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/event/{id}", name="event")
   */
  public function event(Environment $twig, EventRepository $repo, Request $request, string $id): Response
  {
    return new Response($twig->render('event/event.html.twig', [
      'event' => $repo->find($id),
    ]));
  }

  /**
   * @Route("api/category", name="api-category-no-locale")
   */
  public function apiCategoryNoLocale(): Response
  {
    return $this->redirectToRoute('category', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/api/category", name="api-category", methods={"GET"})
   */
  public function apiCategory(SerializerInterface $serializer, CategoryRepository $repo, Request $request): JsonResponse
  {
    $result = $repo->findAllWithTrans($request);

    return new JsonResponse(
      $serializer->serialize($result, 'json', ['groups' => 'category:i18n']),
      Response::HTTP_OK,
      [],
      true
    );
  }

  /**
   * @Route("api/guest", name="api-guest-no-locale")
   */
  public function apiGuestNoLocale(): Response
  {
    return $this->redirectToRoute('guest', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/api/guest", name="api-guest", methods={"GET"})
   */
  public function apiGuest(SerializerInterface $serializer, GuestRepository $repo, Request $request): JsonResponse
  {
    $result = $repo->findAllWithTrans($request);

    return new JsonResponse(
      $serializer->serialize($result, 'json', ['groups' => ['guest:i18n', 'category:i18n']]),
      Response::HTTP_OK,
      [],
      true
    );
  }

  /**
   * @Route("api/place", name="api-place-no-locale")
   */
  public function apiPlaceNoLocale(): Response
  {
    return $this->redirectToRoute('place', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/api/place", name="api-place", methods={"GET"})
   */
  public function apiPlace(SerializerInterface $serializer, PlaceRepository $repo): JsonResponse
  {
    $result = $repo->findAll();

    return new JsonResponse(
      $serializer->serialize($result, 'json',  ['groups' => 'place']),
      Response::HTTP_OK,
      [],
      true
    );
  }

  /**
   * @Route("api/event", name="api-event-no-locale")
   */
  public function apiEventNoLocale(): Response
  {
    return $this->redirectToRoute('event', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/api/event", name="api-event", methods={"GET"})
   */
  public function apiEvent(SerializerInterface $serializer, EventRepository $repo, Request $request): JsonResponse
  {
    $result = $repo->findAllWithTrans($request);

    return new JsonResponse(
      $serializer->serialize($result, 'json',  ['groups' => ['event:i18n', 'place', 'guest:i18n', 'category:i18n']]),
      Response::HTTP_OK,
      [],
      true
    );
  }
}
