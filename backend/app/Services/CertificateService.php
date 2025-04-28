<?php

namespace App\Services;

use App\Interfaces\CertificateRepositoryInterface;

class CertificateService
{
    protected $repository;

    public function __construct(CertificateRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function issueCertificate(array $data)
    {
        return $this->repository->create($data);
    }

    public function getCertificateDetail(int $id)
    {
        return $this->repository->getById($id);
    }

    public function getStudentCertificates(int $studentId)
    {
        return $this->repository->getByStudent($studentId);
    }
}