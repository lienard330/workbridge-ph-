<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("resumes", function (Blueprint $table) {
            $table->id();
            $table->foreignId("seeker_id")->constrained()->cascadeOnDelete();
            $table->string("file_path");
            $table->string("original_name");
            $table->boolean("is_primary")->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("resumes"); }
};
