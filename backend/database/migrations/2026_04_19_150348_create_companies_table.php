<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("companies", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->string("slug")->unique()->nullable();
            $table->string("industry")->nullable();
            $table->string("size")->nullable();
            $table->unsignedSmallInteger("founded_year")->nullable();
            $table->string("website")->nullable();
            $table->text("description")->nullable();
            $table->string("address")->nullable();
            $table->string("city")->nullable();
            $table->string("province")->nullable();
            $table->string("logo")->nullable();
            $table->string("cover_photo")->nullable();
            $table->string("contact_email")->nullable();
            $table->string("contact_phone")->nullable();
            $table->enum("verified_status",["Unverified","Pending","Verified","Rejected","Suspended"])->default("Unverified");
            $table->timestamp("verified_at")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("companies"); }
};
