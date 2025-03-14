<?php
namespace App\Services;

use App\Interfaces\FaqRepositoryInterface;

class FaqService
{
    protected $faqRepository;

    public function __construct(FaqRepositoryInterface $faqRepository)
    {
        $this->faqRepository = $faqRepository;
    }

    public function getAll()
    {
        return $this->faqRepository->getAll();
    }
    public function getById(int $id)
    {
        return $this->faqRepository->getById($id);
    }

    public function getByCategory(string $category)
    {
        return $this->faqRepository->getByCategory($category);
    }

    public function getByStatus(int $status)
    {
        return $this->faqRepository->getByStatus($status);
    }

    public function createFaq(array $data)
    {
        return $this->faqRepository->createFaq($data);
    }

    public function updateFaq(int $id, array $data)
    {
        return $this->faqRepository->updateFaq($id, $data);
    }

    public function deleteFaq(int $id)
    {
        return $this->faqRepository->deleteFaq($id);
    }
}