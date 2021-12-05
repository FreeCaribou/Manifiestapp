<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ORM\Entity(repositoryClass=EventRepository::class)
 */
class Event
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"event"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"event"})
     */
    private $title_fr;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"event"})
     */
    private $title_nl;

    /**
     * @Groups({"event", "event:i18n"})
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     * @Groups({"event"})
     */
    private $description_fr;

    /**
     * @ORM\Column(type="text")
     * @Groups({"event"})
     */
    private $description_nl;

    /**
     * @Groups({"event", "event:i18n"})
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity=Place::class, inversedBy="events")
     * @Groups({"event", "event:i18n"})
     */
    private $place;

    /**
     * @ORM\ManyToMany(targetEntity=Category::class, inversedBy="events")
     * @Groups({"event", "event:i18n"})
     */
    private $categories;

    /**
     * @ORM\ManyToMany(targetEntity=Guest::class, inversedBy="events")
     * @Groups({"event", "event:i18n"})
     */
    private $guests;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->guests = new ArrayCollection();
    }

    public function __toString()
    {
        return (string) $this->getTitleFr() . ' / ' . $this->getTitleNl();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitleFr(): ?string
    {
        return $this->title_fr;
    }

    public function setTitleFr(string $title_fr): self
    {
        $this->title_fr = $title_fr;

        return $this;
    }

    public function getTitleNl(): ?string
    {
        return $this->title_nl;
    }

    public function setTitleNl(string $title_nl): self
    {
        $this->title_nl = $title_nl;

        return $this;
    }

    public function setTitle(Request $request): self
    {
        $o = get_object_vars($this);
        $k = "title_{$request->getLocale()}";
        $this->title = array_key_exists($k, $o) ?
            $o[$k]
            : null;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getDescriptionFr(): ?string
    {
        return $this->description_fr;
    }

    public function setDescriptionFr(string $description_fr): self
    {
        $this->description_fr = $description_fr;

        return $this;
    }

    public function getDescriptionNl(): ?string
    {
        return $this->description_nl;
    }

    public function setDescriptionNl(string $description_nl): self
    {
        $this->description_nl = $description_nl;

        return $this;
    }

    public function setDescription(Request $request): self
    {
        $o = get_object_vars($this);
        $k = "description_{$request->getLocale()}";
        $this->description = array_key_exists($k, $o) ?
            $o[$k]
            : null;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getPlace(): ?place
    {
        return $this->place;
    }

    public function setPlace(?place $place): self
    {
        $this->place = $place;

        return $this;
    }

    public function getPlaceToString(): ?string
    {
        return $this->getPlace();
    }

    /**
     * @return Collection|category[]
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
        }

        return $this;
    }

    public function removeCategory(category $category): self
    {
        $this->categories->removeElement($category);

        return $this;
    }

    public function getCategoriesToString(): ?string
    {
        return implode(" / ", $this->categories->toArray());
    }

    /**
     * @return Collection|guest[]
     */
    public function getGuests(): Collection
    {
        return $this->guests;
    }

    public function addGuest(guest $guest): self
    {
        if (!$this->guests->contains($guest)) {
            $this->guests[] = $guest;
        }

        return $this;
    }

    public function removeGuest(guest $guest): self
    {
        $this->guests->removeElement($guest);

        return $this;
    }

    public function getGuestsToString(): ?string
    {
        return implode(" / ", $this->guests->toArray());
    }
}
