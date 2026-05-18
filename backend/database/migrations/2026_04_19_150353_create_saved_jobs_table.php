<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("saved_jobs", function (Blueprint $table) {
            $table->foreignId("seeker_id")->constrained()->cascadeOnDelete();
            $table->foreignId("job_listing_id")->constrained()->cascadeOnDelete();
            $table->timestamp("saved_at")->useCurrent();
            $table->primary(["seeker_id","job_listing_id"]);
        });
    }
    public function down(): void { Schema::dropIfExists("saved_jobs"); }
};
