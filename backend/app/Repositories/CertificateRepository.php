<?php

namespace App\Repositories;

use App\Models\Certificate;
use App\Interfaces\CertificateRepositoryInterface;

class CertificateRepository implements CertificateRepositoryInterface
{
    public function create(array $data)
    {
        return Certificate::create($data);
    }

    public function getById(int $id)
    {
        return Certificate::with(['student', 'program'])->findOrFail($id);
    }

    public function getByStudent(int $studentId)
    {
        return Certificate::with('program')->where('student_id', $studentId)->get();
    }
}