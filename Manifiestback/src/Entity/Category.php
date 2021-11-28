<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ORM\Entity(repositoryClass=CategoryRepository::class)
 * @ApiResource()
 */
class Category
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"get_item", "get_item_trans"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({"get_item", "get_item_trans"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"get_item"})
     */
    private $label_fr;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"get_item"})
     */
    private $label_nl;

    /**
     * @Groups({"get_item", "get_item_trans"})
     */
    private $label;

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
}
