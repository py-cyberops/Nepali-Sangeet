CREATE TABLE `listener_presence` (
	`sessionKey` varchar(64) NOT NULL,
	`countryCode` varchar(2),
	`isListening` boolean NOT NULL DEFAULT false,
	`lastSeen` timestamp NOT NULL,
	CONSTRAINT `listener_presence_sessionKey` PRIMARY KEY(`sessionKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `listener_presence_last_seen_idx` ON `listener_presence` (`lastSeen`);--> statement-breakpoint
CREATE INDEX `listener_presence_country_idx` ON `listener_presence` (`countryCode`);