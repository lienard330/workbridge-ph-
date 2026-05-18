<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\JobTag;
use App\Models\Resume;
use App\Models\Seeker;
use App\Models\SeekerSkill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Admin WorkBridge',
            'email'    => 'admin@workbridge.ph',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        // Categories
        $cats = [
            ['name' => 'Information Technology', 'slug' => 'it', 'icon' => 'bi-laptop'],
            ['name' => 'Healthcare',              'slug' => 'healthcare', 'icon' => 'bi-heart-pulse'],
            ['name' => 'Education',               'slug' => 'education', 'icon' => 'bi-book'],
            ['name' => 'Business & Finance',      'slug' => 'business', 'icon' => 'bi-briefcase'],
            ['name' => 'Engineering',             'slug' => 'engineering', 'icon' => 'bi-gear'],
            ['name' => 'Hospitality & Tourism',   'slug' => 'hospitality', 'icon' => 'bi-building'],
            ['name' => 'Government & Public Sector', 'slug' => 'government', 'icon' => 'bi-bank'],
            ['name' => 'Arts & Media',            'slug' => 'arts', 'icon' => 'bi-palette'],
        ];

        $categoryMap = [];
        foreach ($cats as $cat) {
            $c = Category::create($cat);
            $categoryMap[$c->slug] = $c->id;
        }

        // Employers + Companies
        $employers = [
            [
                'name' => 'TechNova Solutions',
                'email' => 'hr@technova.ph',
                'industry' => 'Information Technology',
                'city' => 'Calbayog City',
                'province' => 'Western Samar',
                'description' => 'Leading software development company in Eastern Visayas.',
                'size' => '51-200',
                'cat' => 'it',
            ],
            [
                'name' => 'MediCare Samar Hospital',
                'email' => 'careers@medicareSamar.ph',
                'industry' => 'Healthcare',
                'city' => 'Catbalogan City',
                'province' => 'Samar',
                'description' => 'Regional hospital serving the Samar province.',
                'size' => '201-500',
                'cat' => 'healthcare',
            ],
            [
                'name' => 'NwSSU Research Institute',
                'email' => 'research@nwssu.edu.ph',
                'industry' => 'Education',
                'city' => 'Calbayog City',
                'province' => 'Western Samar',
                'description' => 'Research and academic institution under Northwest Samar State University.',
                'size' => '11-50',
                'cat' => 'education',
            ],
            [
                'name' => 'EastWest BPO',
                'email' => 'talent@eastwestbpo.ph',
                'industry' => 'Business & Finance',
                'city' => 'Calbayog City',
                'province' => 'Western Samar',
                'description' => 'BPO company offering customer service and back-office solutions.',
                'size' => '201-500',
                'cat' => 'business',
            ],
        ];

        $companyRefs = [];
        foreach ($employers as $emp) {
            $user = User::create([
                'name'     => $emp['name'] . ' HR',
                'email'    => $emp['email'],
                'password' => Hash::make('password'),
                'role'     => 'employer',
                'status'   => 'active',
            ]);

            $slug = Str::slug($emp['name']) . '-' . $user->id;
            $company = Company::create([
                'user_id'         => $user->id,
                'name'            => $emp['name'],
                'slug'            => $slug,
                'industry'        => $emp['industry'],
                'size'            => $emp['size'],
                'description'     => $emp['description'],
                'city'            => $emp['city'],
                'province'        => $emp['province'],
                'verified_status' => 'Verified',
                'verified_at'     => now(),
            ]);

            $companyRefs[] = ['company' => $company, 'cat' => $emp['cat']];
        }

        // Job listings
        $jobs = [
            [
                'company_idx' => 0,
                'title'       => 'Junior Web Developer',
                'type'        => 'Full-time',
                'experience_level' => 'Entry-level',
                'location'    => 'Calbayog City, Western Samar',
                'salary_min'  => 18000,
                'salary_max'  => 25000,
                'description' => 'Build and maintain web applications using Laravel and Vue.js.',
                'requirements'=> 'Bachelor\'s degree in IT or related field. Knowledge of HTML, CSS, JavaScript.',
                'tags'        => ['Laravel', 'Vue.js', 'MySQL', 'JavaScript'],
            ],
            [
                'company_idx' => 0,
                'title'       => 'IT Support Specialist',
                'type'        => 'Full-time',
                'experience_level' => 'Mid-level',
                'location'    => 'Calbayog City, Western Samar',
                'salary_min'  => 20000,
                'salary_max'  => 28000,
                'description' => 'Provide technical support and maintain IT infrastructure.',
                'requirements'=> '2+ years experience in IT support. Networking knowledge required.',
                'tags'        => ['Networking', 'Windows Server', 'Technical Support'],
            ],
            [
                'company_idx' => 1,
                'title'       => 'Staff Nurse',
                'type'        => 'Full-time',
                'experience_level' => 'Entry-level',
                'location'    => 'Catbalogan City, Samar',
                'salary_min'  => 22000,
                'salary_max'  => 30000,
                'description' => 'Provide quality patient care in a regional hospital setting.',
                'requirements'=> 'BSN graduate. PRC license required. Board passer preferred.',
                'tags'        => ['Nursing', 'Patient Care', 'PRC Licensed'],
            ],
            [
                'company_idx' => 2,
                'title'       => 'Research Assistant',
                'type'        => 'Contract',
                'experience_level' => 'Entry-level',
                'location'    => 'Calbayog City, Western Samar',
                'salary_min'  => 15000,
                'salary_max'  => 20000,
                'description' => 'Assist in academic and applied research projects.',
                'requirements'=> 'Bachelor\'s degree in any field. Strong writing and analytical skills.',
                'tags'        => ['Research', 'Data Analysis', 'Academic Writing'],
            ],
            [
                'company_idx' => 3,
                'title'       => 'Customer Service Representative',
                'type'        => 'Full-time',
                'experience_level' => 'Entry-level',
                'location'    => 'Calbayog City, Western Samar',
                'salary_min'  => 16000,
                'salary_max'  => 20000,
                'description' => 'Handle customer inquiries via phone and chat.',
                'requirements'=> 'Excellent English communication skills. Can work in shifts.',
                'tags'        => ['Customer Service', 'BPO', 'English Communication'],
            ],
            [
                'company_idx' => 3,
                'title'       => 'Team Leader - BPO',
                'type'        => 'Full-time',
                'experience_level' => 'Mid-level',
                'location'    => 'Calbayog City, Western Samar',
                'salary_min'  => 28000,
                'salary_max'  => 35000,
                'description' => 'Lead a team of 10-15 CSRs, monitor KPIs, and drive performance.',
                'requirements'=> '2+ years BPO team leader experience.',
                'tags'        => ['Team Management', 'KPI', 'BPO', 'Leadership'],
            ],
        ];

        $jobRefs = [];
        foreach ($jobs as $j) {
            $ref = $companyRefs[$j['company_idx']];
            $job = JobListing::create([
                'company_id'       => $ref['company']->id,
                'category_id'      => $categoryMap[$ref['cat']],
                'title'            => $j['title'],
                'type'             => $j['type'],
                'experience_level' => $j['experience_level'],
                'location'         => $j['location'],
                'salary_min'       => $j['salary_min'],
                'salary_max'       => $j['salary_max'],
                'description'      => $j['description'],
                'requirements'     => $j['requirements'],
                'status'           => 'Open',
                'slots'            => 2,
                'deadline'         => now()->addDays(30),
            ]);

            foreach ($j['tags'] as $tag) {
                JobTag::create(['job_listing_id' => $job->id, 'tag' => $tag]);
            }

            $jobRefs[] = $job;
        }

        // Seekers
        $seekers = [
            ['name' => 'Juan dela Cruz',    'email' => 'juan@example.com',    'skills' => ['JavaScript', 'HTML', 'CSS', 'Laravel']],
            ['name' => 'Maria Santos',      'email' => 'maria@example.com',   'skills' => ['Nursing', 'Patient Care', 'BLS']],
            ['name' => 'Jose Reyes',        'email' => 'jose@example.com',    'skills' => ['Research', 'Data Analysis', 'Excel']],
            ['name' => 'Ana Gonzales',      'email' => 'ana@example.com',     'skills' => ['Customer Service', 'English Communication', 'MS Office']],
            ['name' => 'Pedro Bautista',    'email' => 'pedro@example.com',   'skills' => ['Networking', 'Windows Server', 'Linux']],
        ];

        foreach ($seekers as $idx => $s) {
            $user = User::create([
                'name'     => $s['name'],
                'email'    => $s['email'],
                'password' => Hash::make('password'),
                'role'     => 'seeker',
                'status'   => 'active',
            ]);

            $seeker = Seeker::create([
                'user_id'          => $user->id,
                'headline'         => $s['skills'][0] . ' Professional',
                'bio'              => 'Motivated professional from Western Samar seeking opportunities.',
                'location'         => 'Calbayog City, Western Samar',
                'phone'            => '09' . rand(100000000, 999999999),
                'profile_strength' => 80,
            ]);

            foreach ($s['skills'] as $skill) {
                SeekerSkill::create(['seeker_id' => $seeker->id, 'skill' => $skill]);
            }

            // Write a real placeholder PDF to the local disk so Download works
            // end-to-end. Uses UUID filenames to match SeekerController::uploadResume.
            $storedName = Str::uuid() . '.pdf';
            Storage::disk('local')->put('resumes/' . $storedName, $this->placeholderPdf($s['name']));

            Resume::create([
                'seeker_id'     => $seeker->id,
                'file_path'     => 'resumes/' . $storedName,
                'original_name' => Str::slug($s['name']) . '_resume.pdf',
                'is_primary'    => true,
            ]);

            // First 2 seekers apply to first job
            if ($idx < 2) {
                Application::create([
                    'job_listing_id' => $jobRefs[0]->id,
                    'seeker_id'      => $seeker->id,
                    'status'         => $idx === 0 ? 'Reviewing' : 'Pending',
                    'skill_fit'      => $idx === 0 ? 75 : 50,
                ]);
            }
        }
    }

    /**
     * Build a tiny valid PDF (~250 bytes) embedding the seeker's name.
     * The xref byte offsets are computed at runtime so they always match
     * the body length — important because some PDF readers refuse to open
     * files where the offsets are wrong.
     */
    private function placeholderPdf(string $name): string
    {
        $title = "Demo Resume - {$name}";
        $stream = "BT /F1 18 Tf 72 720 Td ({$title}) Tj ET";
        $body4  = "<</Length " . strlen($stream) . ">>\nstream\n{$stream}\nendstream";

        $obj1 = "1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n";
        $obj2 = "2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n";
        $obj3 = "3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>>>\nendobj\n";
        $obj4 = "4 0 obj\n{$body4}\nendobj\n";

        $header = "%PDF-1.4\n";
        $offset1 = strlen($header);
        $offset2 = $offset1 + strlen($obj1);
        $offset3 = $offset2 + strlen($obj2);
        $offset4 = $offset3 + strlen($obj3);
        $xrefPos = $offset4 + strlen($obj4);

        $xref = sprintf(
            "xref\n0 5\n0000000000 65535 f \n%010d 00000 n \n%010d 00000 n \n%010d 00000 n \n%010d 00000 n \n",
            $offset1, $offset2, $offset3, $offset4
        );
        $trailer = "trailer\n<</Size 5/Root 1 0 R>>\nstartxref\n{$xrefPos}\n%%EOF\n";

        return $header . $obj1 . $obj2 . $obj3 . $obj4 . $xref . $trailer;
    }
}
