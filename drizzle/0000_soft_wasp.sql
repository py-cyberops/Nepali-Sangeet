CREATE TABLE `listener_presence` (
	`sessionKey` varchar(64) NOT NULL,
	`countryCode` varchar(2),
	`isListening` boolean NOT NULL DEFAULT false,
	`lastSeen` timestamp NOT NULL,
	`bellLastRung` timestamp,
	CONSTRAINT `listener_presence_sessionKey` PRIMARY KEY(`sessionKey`)
);
--> statement-breakpoint
CREATE TABLE `room_bell_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `room_bell_events_id` PRIMARY KEY(`id`)
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
CREATE INDEX `listener_presence_country_idx` ON `listener_presence` (`countryCode`);--> statement-breakpoint
CREATE INDEX `room_bell_events_created_at_idx` ON `room_bell_events` (`createdAt`);