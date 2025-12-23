CREATE TABLE `bookmarks` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`articleId` varchar(64) NOT NULL,
	`articleTitle` text NOT NULL,
	`partTitle` text NOT NULL,
	`excerpt` text NOT NULL,
	`note` text,
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`)
);
