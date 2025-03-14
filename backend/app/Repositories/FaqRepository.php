<?php
namespace App\Repositories;

use App\Models\Faq;
use App\Interfaces\FaqRepositoryInterface;

class FaqRepository implements FaqRepositoryInterface
{
    public function getAll()
    {
        return Faq::orderBy('priority', 'desc')->get();
    }
    public function getById(int $id)
    {
        return Faq::find($id);
    }

    public function getByCategory(string $category)
    {
        return Faq::where('category', $category)->where('status', 1)->orderBy('priority', 'desc')->get();
    }

    public function getByStatus(int $status)
    {
        return Faq::where('status', $status)->orderBy('priority', 'desc')->get();
    }

    public function createFaq(array $data)
    {
        return Faq::create($data);
    }

    public function updateFaq(int $id, array $data)
    {
        $faq = Faq::findOrFail($id);
        $faq->update($data);
        return $faq;
    }

    public function deleteFaq(int $id)
    {
        return Faq::destroy($id) > 0;
    }
}