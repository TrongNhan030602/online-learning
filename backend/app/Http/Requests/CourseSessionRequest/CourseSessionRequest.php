<?php
namespace App\Http\Requests\CourseSessionRequest;

use Illuminate\Foundation\Http\FormRequest;

class CourseSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Nếu bạn muốn kiểm tra quyền của người dùng, có thể kiểm tra ở đây
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'course_id' => 'required|exists:courses,id', // Môn học phải tồn tại trong bảng courses
            'title' => 'required|string|max:255', // Tiêu đề của buổi học
            'description' => 'nullable|string', // Mô tả của buổi học
            'start_time' => 'required|date|after:today', // Thời gian bắt đầu phải là một ngày hợp lệ và phải sau ngày hôm nay
            'end_time' => 'required|date|after:start_time', // Thời gian kết thúc phải sau thời gian bắt đầu
            'location' => 'required|string|max:255', // Địa điểm của buổi học
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'course_id.required' => 'Môn học là trường bắt buộc.',
            'course_id.exists' => 'Môn học không tồn tại.',
            'title.required' => 'Tiêu đề là trường bắt buộc.',
            'start_time.required' => 'Thời gian bắt đầu là trường bắt buộc.',
            'start_time.after' => 'Thời gian bắt đầu phải sau ngày hôm nay.',
            'end_time.required' => 'Thời gian kết thúc là trường bắt buộc.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'location.required' => 'Địa điểm là trường bắt buộc.',
        ];
    }
}