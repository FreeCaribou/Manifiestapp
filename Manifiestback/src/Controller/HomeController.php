<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use App\Repository\CategoryRepository;
use App\Repository\GuestRepository;
use Symfony\Component\Serializer\SerializerInterface;
use Twig\Environment;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
  /**
   * @Route("/", name="home-no-lang")
   */
  public function indexNoLocale(): Response
  {
    return $this->redirectToRoute('home', ['_locale' => 'fr']);
  }

  /**
   * @Route("/{_locale<%app.supported_locales%>}/", name="home")
   */
  public function index(Environment $twig, CategoryRepository $repo, Request $request): Response
  {
    // $request->getLocale();
    return new Response($twig->render('home/index.html.twig', [
      'categories' => $repo->findAllWithTrans($request),
    ]));
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
}
