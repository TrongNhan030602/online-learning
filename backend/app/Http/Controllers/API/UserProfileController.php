<?php
namespace App\Http\Controllers\API;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Services\UserProfileService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UserProfile\UpdateAvatarRequest;
use App\Http\Requests\UserProfile\UpdateProfileRequest;

class UserProfileController extends Controller
{
    protected $profileService;

    public function __construct(UserProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    // 📌 API: Lấy thông tin hồ sơ
    public function show()
    {
        $userId = Auth::id();
        $profile = $this->profileService->getProfile($userId);

        return response()->json([
            'first_name' => $profile->first_name,
            'last_name' => $profile->last_name,
            'username' => $profile->user->name,
            'email' => $profile->user->email,
            'phone' => $profile->phone,
            'address' => $profile->address,
            'gender' => $profile->gender,
            'position' => $profile->position,
            'info' => $profile->info,
            'avatar' => $profile->avatar,
        ]);
    }



    // 📌 API: Cập nhật thông tin hồ sơ
    public function update(UpdateProfileRequest $request)
    {
        $userId = Auth::id();
        $data = $request->validated();
        return response()->json($this->profileService->updateProfile($userId, $data));
    }
    public function updateAvatar(UpdateAvatarRequest $request)
    {
        $userId = Auth::id();
        $file = $request->file('avatar');

        // Lấy tên file an toàn
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
        $slug = Str::slug($nameWithoutExt);
        $newName = $slug . '-' . time() . '.' . $extension;

        // Lưu vào storage/app/public/avatars/
        $path = $file->storeAs('avatars', $newName, 'public');

        // Cập nhật đường dẫn trong DB (chỉ lưu /avatars/xxx.png)
        $this->profileService->updateAvatar($userId, 'avatars/' . $newName);

        return response()->json(['avatar' => 'avatars/' . $newName]);
    }




}