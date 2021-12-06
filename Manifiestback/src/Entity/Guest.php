<?php

namespace App\Entity;

use App\Repository\GuestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=GuestRepository::class)
 */
class Guest
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"guest", "guest:i18n"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"guest", "guest:i18n"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"guest"})
     */
    private $description_fr;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"guest"})
     */
    private $description_nl;

    /**
     * @Groups({"guest", "guest:i18n"})
     */
    private $description;

    /**
     * @ORM\ManyToMany(targetEntity=Category::class)
     * @Groups({"guest", "guest:i18n"})
     */
    private $categories;

    /**
     * @ORM\ManyToMany(targetEntity=Event::class, mappedBy="guests")
     */
    private $events;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"guest", "guest:i18n"})
     */
    private $picture;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->events = new ArrayCollection();
    }

    public function __toString()
    {
        return (string) $this->getName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescriptionFr(): ?string
    {
        return $this->description_fr;
    }

    public function setDescriptionFr(?string $description_fr): self
    {
        $this->description_fr = $description_fr;

        return $this;
    }

    public function getDescriptionNl(): ?string
    {
        return $this->description_nl;
    }

    public function setDescriptionNl(?string $description_nl): self
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

    /**
     * @return Collection|Category[]
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function getCategoriesToString(): ?string
    {
        return implode(" / ", $this->categories->toArray());
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
        }

        return $this;
    }

    public function removeCategory(Category $category): self
    {
        $this->categories->removeElement($category);

        return $this;
    }

    /**
     * @return Collection|Event[]
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->addGuest($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeGuest($this);
        }

        return $this;
    }

    public function getPicture()
    {
        return $this->picture;
    }

    public function setPicture($picture): self
    {
        $this->picture = $picture;

        return $this;
    }
}
