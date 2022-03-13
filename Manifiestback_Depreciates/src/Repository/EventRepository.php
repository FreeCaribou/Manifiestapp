<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;

/**
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    public function findAllWithTrans(Request $request)
    {
        $result = parent::findAll();
        foreach ($result as $value) {
            $value->setDescription($request);
            $value->setTitle($request);

            foreach ($value->getCategories() as $cat) {
                $cat->setLabel($request);
            }

            foreach ($value->getGuests() as $guest) {
                $guest->setDescription($request);
                foreach ($guest->getCategories() as $guestCat) {
                    $guestCat->setLabel($request);
                }
            }
        }
        return $result;
    }
}
