<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use App\Repository\CategoryRepository;
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
    return $this->redirectToRoute('home', ['_locale' => 'nl']);
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
   * @Route("/{_locale<%app.supported_locales%>}/test", name="test", methods={"GET"})
   */
  public function test(SerializerInterface $serializer, CategoryRepository $repo, Request $request): JsonResponse
  {
    $result = $repo->findAllWithTrans($request);

    return new JsonResponse(
      $serializer->serialize($result, 'json', ['groups' => 'get_item_trans']),
      Response::HTTP_OK,
      [],
      true
    );
  }
}
