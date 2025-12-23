CREATE TABLE `userSettings` (
	`userId` int NOT NULL,
	`themePreference` varchar(16),
	`fontSize` varchar(8),
	`lineSpacing` varchar(16),
	`readingRemindersEnabled` int,
	`readingReminderTime` varchar(8),
	`readingReminderDays` text,
	`readingGoalType` varchar(16),
	`readingGoalTarget` int,
	`nightModeEnabled` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userSettings_userId` PRIMARY KEY(`userId`)
);
