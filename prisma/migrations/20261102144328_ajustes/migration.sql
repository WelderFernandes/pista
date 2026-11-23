-- CreateTable
CREATE TABLE "ClassRating" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "classSessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassRating_classSessionId_key" ON "ClassRating"("classSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassRating_classSessionId_studentId_key" ON "ClassRating"("classSessionId", "studentId");

-- AddForeignKey
ALTER TABLE "ClassRating" ADD CONSTRAINT "ClassRating_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRating" ADD CONSTRAINT "ClassRating_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRating" ADD CONSTRAINT "ClassRating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
