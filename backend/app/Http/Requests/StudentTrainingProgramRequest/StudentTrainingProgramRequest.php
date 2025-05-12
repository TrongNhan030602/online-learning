<?php
namespace App\Http\Requests\StudentTrainingProgramRequest;

use Illuminate\Foundation\Http\FormRequest;

class StudentTrainingProgramRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'user_id' => 'required|exists:users,id',
            'training_program_id' => 'required|exists:training_programs,id',
            'entry_type' => 'required|in:default,lien_thong,van_bang_2',
            'from_program_id' => 'nullable|exists:training_programs,id',
        ];

        if ($this->input('entry_type') === 'lien_thong') {
            $rules['from_program_id'] = 'required|exists:training_programs,id'; // Nếu là liên thông thì from_program_id bắt buộc
        }

        return $rules;
    }


    public function messages()
    {
        return [
            'user_id.required' => 'ID người dùng là bắt buộc.',
            'training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'entry_type.required' => 'Loại nhập học là bắt buộc.',
        ];
    }
}