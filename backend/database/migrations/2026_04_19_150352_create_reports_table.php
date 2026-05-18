<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("reports", function (Blueprint $table) {
            $table->id();
            $table->enum("type",["Job","User","Company"]);
            $table->string("target_id");
            $table->string("reason");
            $table->enum("severity",["Low","Medium","High"]);
            $table->enum("status",["Open","Under Review","Resolved"])->default("Open");
            $table->foreignId("reporter_id")->nullable()->constrained("users")->nullOnDelete();
            $table->text("resolution_note")->nullable();
            $table->timestamp("resolved_at")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("reports"); }
};
