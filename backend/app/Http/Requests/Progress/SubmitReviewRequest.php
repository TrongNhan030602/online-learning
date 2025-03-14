<?php
namespace App\Http\Requests\Progress;


use Illuminate\Foundation\Http\FormRequest;

class SubmitReviewRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép tất cả user gửi request này, có thể thêm auth nếu cần
    }


    public function rules()
    {
        return [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ];
    }

    public function messages()
    {
        return [
            'rating.required' => 'Vui lòng chọn số sao.',
            'rating.integer' => 'Số sao phải là số nguyên.',
            'rating.min' => 'Số sao thấp nhất là 1.',
            'rating.max' => 'Số sao cao nhất là 5.',
            'comment.required' => 'Vui lòng nhập nội dung đánh giá.',
            'comment.string' => 'Nội dung đánh giá phải là văn bản.',
            'comment.max' => 'Đánh giá không được vượt quá 1000 ký tự.',
        ];
    }

}