<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\VerificationDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::with('user')->where('verified_status', 'Verified');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('industry', 'like', "%$search%");
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show($id)
    {
        $company = Company::with(['user', 'jobListings' => function ($q) {
            $q->where('status', 'Open')->with('tags')->latest()->limit(10);
        }])->findOrFail($id);

        return response()->json($company);
    }

    public function myCompany(Request $request)
    {
        $company = $request->user()->company()->with('verificationDocuments')->first();
        return response()->json($company);
    }

    public function updateCompany(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (! $company) {
            return response()->json(['message' => 'No company profile found.'], 404);
        }

        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'industry'      => 'nullable|string|max:100',
            'size'          => 'nullable|string|max:50',
            'founded_year'  => 'nullable|integer|min:1800|max:2100',
            'website'       => 'nullable|url|max:255',
            'description'   => 'nullable|string|max:3000',
            'address'       => 'nullable|string|max:255',
            'city'          => 'nullable|string|max:100',
            'province'      => 'nullable|string|max:100',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $company->id;
        }

        $company->update($data);

        return response()->json($company->fresh());
    }

    public function uploadLogo(Request $request)
    {
        $request->validate(['logo' => 'required|image|max:2048']);
        $path = $request->file('logo')->store('logos', 'public');
        $request->user()->company->update(['logo' => $path]);
        return response()->json(['logo' => $path]);
    }

    public function uploadVerificationDoc(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'doc_type' => 'required|string|max:100',
        ]);

        $company = $request->user()->company;

        if (! $company) {
            return response()->json(['message' => 'No company profile.'], 403);
        }

        $file = $request->file('document');
        $path = $file->store('verification_docs', 'public');

        $doc = VerificationDocument::create([
            'company_id'    => $company->id,
            'file_path'     => $path,
            'original_name' => $file->getClientOriginalName(),
            'doc_type'      => $request->input('doc_type'),
        ]);

        return response()->json($doc, 201);
    }
}
