<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("applications", function (Blueprint $table) {
            $table->id();
            $table->foreignId("job_listing_id")->constrained()->cascadeOnDelete();
            $table->foreignId("seeker_id")->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger("resume_id")->nullable();
            $table->text("cover_letter")->nullable();
            $table->enum("status",["Pending","Reviewing","Interview","Hired","Rejected"])->default("Pending");
            $table->text("notes")->nullable();
            $table->unsignedTinyInteger("skill_fit")->nullable();
            $table->timestamps();
            $table->unique(["job_listing_id","seeker_id"]);
            $table->index(["seeker_id","status"]);
        });
    }
    public function down(): void { Schema::dropIfExists("applications"); }
};
