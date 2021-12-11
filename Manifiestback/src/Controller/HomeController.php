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
    // $request->getLocale();
    return new Response($twig->render('home/index.html.twig', [
      'guests' => $repo->findAllWithTrans($request),
    ]));
  }

  /**
   * @Route("/category", name="category-no-locale")
   */
  public function categoryNoLocale(): Response
  {
    return $this->redirectToRoute('category', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/category", name="category", methods={"GET"})
   */
  public function category(SerializerInterface $serializer, CategoryRepository $repo, Request $request): JsonResponse
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
   * @Route("/guest", name="guest-no-locale")
   */
  public function guestNoLocale(): Response
  {
    return $this->redirectToRoute('guest', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/guest", name="guest", methods={"GET"})
   */
  public function guest(SerializerInterface $serializer, GuestRepository $repo, Request $request): JsonResponse
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
   * @Route("/place", name="place-no-locale")
   */
  public function placeNoLocale(): Response
  {
    return $this->redirectToRoute('place', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/place", name="place", methods={"GET"})
   */
  public function place(SerializerInterface $serializer, PlaceRepository $repo): JsonResponse
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
   * @Route("/event", name="event-no-locale")
   */
  public function eventNoLocale(): Response
  {
    return $this->redirectToRoute('event', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/event", name="event", methods={"GET"})
   */
  public function event(SerializerInterface $serializer, EventRepository $repo, Request $request): JsonResponse
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
