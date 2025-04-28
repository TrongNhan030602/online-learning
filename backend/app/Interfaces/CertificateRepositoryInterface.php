<?php

namespace App\Interfaces;

interface CertificateRepositoryInterface
{
    public function create(array $data);
    public function getById(int $id);
    public function getByStudent(int $studentId);
}