<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("seeker_skills", function (Blueprint $table) {
            $table->id();
            $table->foreignId("seeker_id")->constrained()->cascadeOnDelete();
            $table->string("skill");
        });
    }
    public function down(): void { Schema::dropIfExists("seeker_skills"); }
};
