<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("job_listings", function (Blueprint $table) {
            $table->id();
            $table->foreignId("company_id")->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger("category_id")->nullable();
            $table->string("title");
            $table->text("description")->nullable();
            $table->text("requirements")->nullable();
            $table->string("location");
            $table->enum("type",["Full-time","Part-time","Contract","Internship","Freelance"]);
            $table->enum("experience_level",["Entry-level","Mid-level","Senior","Executive"])->default("Entry-level");
            $table->decimal("salary_min",10,2)->nullable();
            $table->decimal("salary_max",10,2)->nullable();
            $table->unsignedInteger("slots")->default(1);
            $table->date("deadline")->nullable();
            $table->enum("status",["Open","Closed","Draft"])->default("Open");
            $table->timestamps();
            $table->index(["status","location","type"]);
        });
    }
    public function down(): void { Schema::dropIfExists("job_listings"); }
};
