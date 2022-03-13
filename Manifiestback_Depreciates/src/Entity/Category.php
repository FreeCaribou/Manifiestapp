<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ORM\Entity(repositoryClass=CategoryRepository::class)
 */
class Category
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"category", "category:i18n"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({"category", "category:i18n"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"category"})
     */
    private $label_fr;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"category"})
     */
    private $label_nl;

    /**
     * @Groups({"category", "category:i18n"})
     */
    private $label;

    /**
     * @ORM\ManyToMany(targetEntity=Event::class, mappedBy="categories")
     */
    private $events;

    public function __construct()
    {
        $this->events = new ArrayCollection();
    }

    public function __toString()
    {
        return (string) $this->getCode();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getLabelFr(): ?string
    {
        return $this->label_fr;
    }

    public function setLabelFr(string $label_fr): self
    {
        $this->label_fr = $label_fr;

        return $this;
    }

    public function getLabelNl(): ?string
    {
        return $this->label_nl;
    }

    public function setLabelNl(?string $label_nl): self
    {
        $this->label_nl = $label_nl;

        return $this;
    }

    public function setLabel(Request $request): self
    {
        $o = get_object_vars($this);
        $k = "label_{$request->getLocale()}";
        $this->label = array_key_exists($k, $o) ?
            $o[$k]
            : null;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
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
            $event->addCategory($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeCategory($this);
        }

        return $this;
    }
}
