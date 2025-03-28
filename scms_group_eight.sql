-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2025 at 03:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scms_group_eight`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('Scheduled','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `moduleId` int(11) NOT NULL,
  `reservedById` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `code`, `name`, `description`, `credits`, `is_deleted`, `created_at`, `updated_at`, `createdById`) VALUES
(1, 'CI0002', 'Coputing and Software Engineering', NULL, 15, 0, '2025-03-11 23:33:24.403266', '2025-03-11 23:33:24.403266', '22960ecc-c7b5-48ef-8463-a9f7b2831d6b');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `grade` varchar(10) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `enrolled_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `studentId` varchar(36) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('Scheduled','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `attendees_count` int(11) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `organizerId` varchar(36) NOT NULL,
  `assignedToId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_attendees`
--

CREATE TABLE `event_attendees` (
  `eventId` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `attended` tinyint(4) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `registered_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_public` tinyint(4) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `groupId` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'Member',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(4) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `sent_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `senderId` varchar(36) NOT NULL,
  `groupId` int(11) DEFAULT NULL,
  `recipientId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `is_read`, `is_deleted`, `sent_at`, `senderId`, `groupId`, `recipientId`) VALUES
(3, 'hi', 0, 0, '2025-03-16 19:30:42.038746', '22960ecc-c7b5-48ef-8463-a9f7b2831d6b', NULL, '3278871c-dfe1-48c2-a311-e90d1ad90ce6'),
(4, 'hello', 0, 0, '2025-03-16 19:31:38.359209', '22960ecc-c7b5-48ef-8463-a9f7b2831d6b', NULL, '3278871c-dfe1-48c2-a311-e90d1ad90ce6');

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `credits` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `courseId` int(11) NOT NULL,
  `lecturerId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `relatedEntity` varchar(50) DEFAULT NULL,
  `is_read` tinyint(4) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `sent_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `userId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `scope` varchar(50) DEFAULT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `category`, `scope`, `description`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
('', 'read:messages', 'chat', NULL, 'View chat messages', 1, 0, '2025-03-16 18:51:46.106400', '2025-03-16 18:51:46.106400'),
('10000000-0000-0000-0000-000000000001', 'create:users', 'Users', 'system', 'Updated view reservations permission on 2025-03-11 08:01 AM PDT', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-11 20:51:01.000000'),
('10000000-0000-0000-0000-000000000002', 'read:users', 'Users', 'system', 'View users', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('10000000-0000-0000-0000-000000000003', 'update:users', 'Users', 'system', 'Update users', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('10000000-0000-0000-0000-000000000004', 'delete:users', 'Users', 'system', 'Delete users', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('194f067f-b98b-4439-a9c6-728afb20d476', 'enroll:courses', 'Courses', 'courses', 'Enroll in courses', 1, 0, '2025-03-09 09:47:25.856200', '2025-03-09 09:47:25.856200'),
('1e3f5795-9576-460c-884f-3e0fc786738d', 'reserve:resources', 'Resources', 'resources', 'Reserve resources', 1, 0, '2025-03-09 09:47:25.725510', '2025-03-09 09:47:25.725510'),
('20000000-0000-0000-0000-000000000001', 'create:events', 'Events', 'events', 'Create events', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('20000000-0000-0000-0000-000000000002', 'read:events', 'Events', 'events', 'View events (alias for view:events)', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('20000000-0000-0000-0000-000000000003', 'update:events', 'Events', 'events', 'Update events', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('20000000-0000-0000-0000-000000000004', 'delete:events', 'Events', 'events', 'Delete events', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('30000000-0000-0000-0000-000000000001', 'create:courses', 'Courses', 'courses', 'Create courses', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('30000000-0000-0000-0000-000000000002', 'read:courses', 'Courses', 'courses', 'View courses', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('30000000-0000-0000-0000-000000000003', 'update:courses', 'Courses', 'courses', 'Update courses', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('30000000-0000-0000-0000-000000000004', 'delete:courses', 'Courses', 'courses', 'Delete courses', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('376310bb-4cc4-4ab6-8ff5-02d1e6406306', 'view:events', 'Events', 'events', 'View events', 1, 0, '2025-03-09 09:47:25.820491', '2025-03-09 09:47:25.820491'),
('3a19c379-65a4-43db-98a9-9f8dcd3f7a39', 'read:reservations', 'Reservations', 'reservations', 'View reservations', 1, 0, '2025-03-11 00:32:39.000000', '2025-03-11 00:32:39.000000'),
('40000000-0000-0000-0000-000000000001', 'create:resources', 'Resources', 'resources', 'Create resources', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('40000000-0000-0000-0000-000000000002', 'read:resources', 'Resources', 'resources', 'View resources', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('40000000-0000-0000-0000-000000000003', 'update:resources', 'Resources', 'resources', 'Update resources', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('40000000-0000-0000-0000-000000000004', 'delete:resources', 'Resources', 'resources', 'Delete resources', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('4c4d6e2c-d157-4ac6-9d32-49a9b1150104', 'create:reservations', 'Reservations', 'reservations', 'Request resource reservations', 1, 0, '2025-03-11 00:32:39.000000', '2025-03-11 00:32:39.000000'),
('50000000-0000-0000-0000-000000000001', 'create:roles', 'Roles', 'system', 'Create roles', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('50000000-0000-0000-0000-000000000002', 'read:roles', 'Roles', 'system', 'View roles', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('50000000-0000-0000-0000-000000000003', 'update:roles', 'Roles', 'system', 'Update roles', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('50000000-0000-0000-0000-000000000004', 'delete:roles', 'Roles', 'system', 'Delete roles', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('52c76365-4b1a-4f87-bd01-cc2a52947395', 'read:groups', 'chat', NULL, 'dea', 1, 0, '2025-03-16 19:12:33.461200', '2025-03-16 19:12:33.461200'),
('60000000-0000-0000-0000-000000000001', 'create:permissions', 'Permissions', 'system', 'Create permissions', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('60000000-0000-0000-0000-000000000002', 'read:permissions', 'Permissions', 'system', 'View permissions', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('60000000-0000-0000-0000-000000000003', 'update:permissions', 'Permissions', 'system', 'Update permissions', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('60000000-0000-0000-0000-000000000004', 'delete:permissions', 'Permissions', 'system', 'Delete permissions', 1, 0, '2025-03-09 20:01:03.000000', '2025-03-09 20:01:03.000000'),
('9cf455e7-4f89-441a-a9c0-4016c5e0a00d', 'test:feature', 'Features', 'system', 'Test feature permission created on 2025-03-11 08:01 AM PDT', 1, 1, '2025-03-11 20:47:15.625037', '2025-03-11 21:07:59.000000'),
('9e62e81f-df1e-4fcd-875e-0f10d5f1ffbe', 'update:reservations', 'Reservations', 'reservations', 'Approve or reject reservations', 1, 0, '2025-03-11 00:32:39.000000', '2025-03-11 00:32:39.000000'),
('a572f9c5-30f9-4f1d-9d70-68723171d2f0', 'read:resource_types', 'Resources', 'resources', 'View resource types', 1, 0, '2025-03-11 00:49:20.000000', '2025-03-11 00:49:20.000000'),
('b6cb3fcb-4cd5-42cc-95e6-f75a0d57f92f', 'create:resource_types', 'Resources', 'resources', 'Create resource types', 1, 0, '2025-03-11 00:49:20.000000', '2025-03-11 00:49:20.000000'),
('b7626173-83da-4e64-b9dc-335c0c92aeb5', 'create:enrollments', 'chat', NULL, 'dumb', 1, 0, '2025-03-16 19:12:24.590515', '2025-03-16 19:12:24.590515'),
('c1b79814-c4e9-4f1f-bf56-bf274b94a105', 'update:resource_types', 'Resources', 'resources', 'Update resource types', 1, 0, '2025-03-11 00:49:20.000000', '2025-03-11 00:49:20.000000'),
('d4db47da-9b2d-4ffb-b9a7-456db52e545b', 'delete:resource_types', 'Resources', 'resources', 'Delete resource types', 1, 0, '2025-03-11 00:49:20.000000', '2025-03-11 00:49:20.000000'),
('d8ea5554-4c2f-434b-94b1-aefd7b05c79c', 'create:messages', 'chat', NULL, 'create new messages', 1, 0, '2025-03-16 19:17:19.307742', '2025-03-16 19:17:19.307742');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `resourceId` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
  `purpose` text DEFAULT NULL,
  `approvedById` varchar(36) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `typeId` int(11) NOT NULL,
  `status` enum('Available','Reserved','Maintenance') DEFAULT 'Available',
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `name`, `description`, `typeId`, `status`, `is_deleted`) VALUES
(1, 'Acer Laptop 0002', 'Updated on 2025-03-11 08:01 AM PDT', 1, 'Reserved', 0),
(2, 'Conference Room A', 'Added on 2025-03-11 08:01 AM PDT', 1, 'Available', 1);

-- --------------------------------------------------------

--
-- Table structure for table `resource_types`
--

CREATE TABLE `resource_types` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_types`
--

INSERT INTO `resource_types` (`id`, `type`, `is_deleted`) VALUES
(1, 'Laptops', 0),
(2, 'Conference Room', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_deleted`, `created_at`, `updated_at`) VALUES
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'Admin', 'Full system access', 0, '2025-03-06 04:21:22.085190', '2025-03-06 04:21:22.085190'),
('34748133-5790-4d6e-adc4-61f6738f90b4', 'Lecturer', 'Teach and reserve resources', 0, '2025-03-09 09:47:25.909124', '2025-03-09 09:47:25.909124'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', 'Staff', 'Manage resources and events', 0, '2025-03-09 09:47:25.882126', '2025-03-09 09:47:25.882126'),
('95a53ac3-9ba9-4593-afca-63788ea757de', 'Student', 'Basic access', 0, '2025-03-09 09:47:25.986967', '2025-03-09 09:47:25.986967'),
('e6594f08-6fe4-49b3-99da-fb17385fb2ed', 'Teacher', 'Role for teachers', 1, '2025-03-11 21:06:15.139656', '2025-03-11 21:06:23.000000');

-- --------------------------------------------------------

--
-- Table structure for table `roles_permissions`
--

CREATE TABLE `roles_permissions` (
  `rolesId` varchar(36) NOT NULL,
  `permissionsId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles_permissions`
--

INSERT INTO `roles_permissions` (`rolesId`, `permissionsId`) VALUES
('119f6092-72b7-4f0c-9e56-82a60cec28f2', ''),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '10000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '10000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '10000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '10000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '194f067f-b98b-4439-a9c6-728afb20d476'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '1e3f5795-9576-460c-884f-3e0fc786738d'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '20000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '20000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '20000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '20000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '30000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '30000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '30000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '30000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '376310bb-4cc4-4ab6-8ff5-02d1e6406306'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '3a19c379-65a4-43db-98a9-9f8dcd3f7a39'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '40000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '40000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '40000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '40000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '4c4d6e2c-d157-4ac6-9d32-49a9b1150104'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '50000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '50000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '50000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '50000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '52c76365-4b1a-4f87-bd01-cc2a52947395'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '60000000-0000-0000-0000-000000000001'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '60000000-0000-0000-0000-000000000002'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '60000000-0000-0000-0000-000000000003'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '60000000-0000-0000-0000-000000000004'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', '9e62e81f-df1e-4fcd-875e-0f10d5f1ffbe'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'a572f9c5-30f9-4f1d-9d70-68723171d2f0'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'b6cb3fcb-4cd5-42cc-95e6-f75a0d57f92f'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'b7626173-83da-4e64-b9dc-335c0c92aeb5'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'c1b79814-c4e9-4f1f-bf56-bf274b94a105'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'd4db47da-9b2d-4ffb-b9a7-456db52e545b'),
('119f6092-72b7-4f0c-9e56-82a60cec28f2', 'd8ea5554-4c2f-434b-94b1-aefd7b05c79c'),
('34748133-5790-4d6e-adc4-61f6738f90b4', '1e3f5795-9576-460c-884f-3e0fc786738d'),
('34748133-5790-4d6e-adc4-61f6738f90b4', '20000000-0000-0000-0000-000000000001'),
('34748133-5790-4d6e-adc4-61f6738f90b4', '20000000-0000-0000-0000-000000000002'),
('34748133-5790-4d6e-adc4-61f6738f90b4', '20000000-0000-0000-0000-000000000003'),
('34748133-5790-4d6e-adc4-61f6738f90b4', '40000000-0000-0000-0000-000000000002'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '20000000-0000-0000-0000-000000000001'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '20000000-0000-0000-0000-000000000002'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '20000000-0000-0000-0000-000000000003'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '20000000-0000-0000-0000-000000000004'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '40000000-0000-0000-0000-000000000001'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '40000000-0000-0000-0000-000000000002'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '40000000-0000-0000-0000-000000000003'),
('770c1038-eb9b-40c2-b114-3335c6e57c05', '40000000-0000-0000-0000-000000000004'),
('95a53ac3-9ba9-4593-afca-63788ea757de', '194f067f-b98b-4439-a9c6-728afb20d476'),
('95a53ac3-9ba9-4593-afca-63788ea757de', '1e3f5795-9576-460c-884f-3e0fc786738d'),
('95a53ac3-9ba9-4593-afca-63788ea757de', '20000000-0000-0000-0000-000000000002'),
('95a53ac3-9ba9-4593-afca-63788ea757de', '20000000-0000-0000-0000-000000000003'),
('e6594f08-6fe4-49b3-99da-fb17385fb2ed', '20000000-0000-0000-0000-000000000001'),
('e6594f08-6fe4-49b3-99da-fb17385fb2ed', '30000000-0000-0000-0000-000000000002'),
('e6594f08-6fe4-49b3-99da-fb17385fb2ed', '3a19c379-65a4-43db-98a9-9f8dcd3f7a39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `is_first_login` tinyint(4) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `refreshTokens` text DEFAULT NULL,
  `last_activity` timestamp NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `roleId` varchar(36) DEFAULT NULL,
  `directPermissions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `phone_number`, `is_active`, `is_first_login`, `is_deleted`, `refreshTokens`, `last_activity`, `created_at`, `updated_at`, `roleId`, `directPermissions`) VALUES
('050621d4-2562-4cfa-8cdc-cfa76c595497', 'sayuru.staff@scms.com', '$2a$10$dzHChPGDzIIxc27Miny2W.SMieuE41rc/WpbDdm.1KLv2Qt3WrU3S', 'Sayuru', 'De Alwis', '0778279803', 1, 1, 0, NULL, NULL, '2025-03-09 19:38:37.260302', '2025-03-09 19:39:09.000000', '770c1038-eb9b-40c2-b114-3335c6e57c05', NULL),
('22960ecc-c7b5-48ef-8463-a9f7b2831d6b', 'admin@scms.com', '$2a$10$CzD8HhFZbNCPOpJn7iehxuhI6XPea48TDs/JApL0qXwtNYtsq74qG', 'Sayuru', 'De Alwis', '+94778279803', 1, 1, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjk2MGVjYy1jN2I1LTQ4ZWYtODQ2My1hOWY3YjI4MzFkNmIiLCJpYXQiOjE3NDE3MDg0OTcsImV4cCI6MTc0MjMxMzI5N30.vJWOG9A38hDk4TkeZCNe5o8LihvYt56Ge5dQzPBHoSA,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjk2MGVjYy1jN2I1LTQ4ZWYtODQ2My1hOWY3YjI4MzFkNmIiLCJpYXQiOjE3NDE3MDg1MzAsImV4cCI6MTc0MjMxMzMzMH0.k40dYCjj2qyWJy5-9-GyM0raM12NTLAPXym1cNJMDdw,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjk2MGVjYy1jN2I1LTQ4ZWYtODQ2My1hOWY3YjI4MzFkNmIiLCJpYXQiOjE3NDIxMjk2OTMsImV4cCI6MTc0MjczNDQ5M30.PHO29WsGjDhQaS6Z5HM7Xr8rn3Pdc50-cyrToKBtu9A,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjk2MGVjYy1jN2I1LTQ4ZWYtODQ2My1hOWY3YjI4MzFkNmIiLCJpYXQiOjE3NDIxMzE3MTksImV4cCI6MTc0MjczNjUxOX0.uwtxhWUbO8onqMv1yebGbfThF1trI36DXNNquRDUB4U,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjk2MGVjYy1jN2I1LTQ4ZWYtODQ2My1hOWY3YjI4MzFkNmIiLCJpYXQiOjE3NDIxMzM2MzUsImV4cCI6MTc0MjczODQzNX0.SUrct4pIYmV-ZyHsNYQR3GPRW243fv9YLgXylQyWvlY', '2025-03-16 13:30:17', '2025-03-11 21:24:37.647065', '2025-03-16 19:30:35.000000', '119f6092-72b7-4f0c-9e56-82a60cec28f2', 'read:events,reserve:resources'),
('3278871c-dfe1-48c2-a311-e90d1ad90ce6', 'sadaruwan.student@scms.com', '$2a$10$NJ.IDLnbgVj60jL.4HGN/.VsiKEDE2O.EdVdEJF2BPgSpMOP5ENsC', 'Sadaruwan', 'Gamage', '0712345678', 1, 1, 0, NULL, NULL, '2025-03-09 22:20:05.637969', '2025-03-09 22:20:05.637969', '95a53ac3-9ba9-4593-afca-63788ea757de', NULL),
('6a074915-40b4-4457-a741-5c875f56e28b', 'janani.lecturer@scms.com', '$2a$10$5ZlJ/CU4hleN2E16W9k.dODqpSe0zo.BUJ3iM1M5ueOI81ftAckv6', 'janani', 'Balasooriya', '0771233211', 1, 1, 0, NULL, NULL, '2025-03-09 21:28:23.827161', '2025-03-09 21:28:23.827161', '34748133-5790-4d6e-adc4-61f6738f90b4', 'create:events,read:events,update:events,delete:events,create:courses,read:courses,update:courses,delete:courses,view:events'),
('6ae18774-5595-48f5-84d8-b7eacec71544', 'sayuru99@scms.com', '$2a$10$uIa27OfxC9Yt38qDdnk/keX6293iYV1v6WZ.atj8R8J.810sMDgY6', 'Sayuru', 'De Alwis Updated', '+94778279803', 1, 0, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWUxODc3NC01NTk1LTQ4ZjUtODRkOC1iN2VhY2VjNzE1NDQiLCJpYXQiOjE3NDE3MDYwNzUsImV4cCI6MTc0MjMxMDg3NX0.JDEMOl8pWs8_nUtjYXMUeBOwHn4SkTeB1xnSyBqpL5E,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWUxODc3NC01NTk1LTQ4ZjUtODRkOC1iN2VhY2VjNzE1NDQiLCJpYXQiOjE3NDE3MDYxNDYsImV4cCI6MTc0MjMxMDk0Nn0.bmq2du4z6a443lqi3FRa-vnbST13wqC_mJkaK29-ULg,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWUxODc3NC01NTk1LTQ4ZjUtODRkOC1iN2VhY2VjNzE1NDQiLCJpYXQiOjE3NDE3MDYxODYsImV4cCI6MTc0MjMxMDk4Nn0.bKK_8fS04NvplajvCliodtLQk-x6kCAC58LcKgwN-y8,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWUxODc3NC01NTk1LTQ4ZjUtODRkOC1iN2VhY2VjNzE1NDQiLCJpYXQiOjE3NDE3MDYyMTAsImV4cCI6MTc0MjMxMTAxMH0.XEvjTffIMxMhLtet1ryjpBzRYx49FbPryNq0EVW5TGo,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWUxODc3NC01NTk1LTQ4ZjUtODRkOC1iN2VhY2VjNzE1NDQiLCJpYXQiOjE3NDE3MDcyOTksImV4cCI6MTc0MjMxMjA5OX0.Q5Rr4aFaN_clcaHtFcVcstIRWJlew8RncCSLdJWG4fE', '2025-03-11 15:34:55', '2025-03-06 04:21:22.214774', '2025-03-11 21:05:37.000000', '95a53ac3-9ba9-4593-afca-63788ea757de', 'read:events,reserve:resources'),
('df0a88f3-d5e9-478a-8ad3-1eb4474c99de', 'sayuru.admin@scms.com', '$2a$10$xYhNkKsGl//I6i842q4j4eISG7fwfrLUfdk/0pNJVwz.XlX8kTEk6', 'Sayuru', 'De Alwis', '0778279803', 1, 1, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZjBhODhmMy1kNWU5LTQ3OGEtOGFkMy0xZWI0NDc0Yzk5ZGUiLCJpYXQiOjE3NDE1MzczNDcsImV4cCI6MTc0MjE0MjE0N30.qypKZIn_1plEs3bQVt7Gb9izqNaijponzgwMXnzepro', '2025-03-09 16:22:27', '2025-03-09 21:51:22.667035', '2025-03-11 02:25:18.000000', '119f6092-72b7-4f0c-9e56-82a60cec28f2', 'create:users,read:users,update:users,delete:users,enroll:courses,reserve:resources,create:events,read:events,update:events,delete:events,create:courses,read:courses,update:courses,delete:courses,view:events,read:reservations,create:resources,read:resources,update:resources,delete:resources,create:reservations,create:roles,read:roles,update:roles,delete:roles,create:permissions,read:permissions,update:permissions,delete:permissions,update:reservations,read:resource_types,create:resource_types,update:resource_types,delete:resource_types'),
('f19edefc-e9b2-4abb-9ecc-0d682e135995', 'sayuru@scms.com', '$2a$10$mdm7QfhuUzOND5WRsKSyTeewxkb9iIIW11YeZ.26jOvKOJ7tIaOUG', 'Sayuru', 'De Alwis', '+94778279803', 1, 1, 0, NULL, NULL, '2025-03-09 12:58:53.709819', '2025-03-09 12:58:53.709819', '95a53ac3-9ba9-4593-afca-63788ea757de', 'crud:events,crud:resources');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_08486e3f0fccc870023753db07e` (`moduleId`),
  ADD KEY `FK_e8bc6827c71ad19f5645eeed081` (`reservedById`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_86b3589486bac01d2903e22471` (`code`),
  ADD KEY `FK_3fff66ead8c0964a1805eb194b3` (`createdById`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_bf3ba3dfa95e2df7388eb4589fd` (`studentId`),
  ADD KEY `FK_60dd0ae4e21002e63a5fdefeec8` (`courseId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1024d476207981d1c72232cf3ca` (`organizerId`),
  ADD KEY `FK_8a92756d1f59cf7000bb84f4e44` (`assignedToId`);

--
-- Indexes for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD PRIMARY KEY (`eventId`,`userId`),
  ADD KEY `FK_07eb323a7b08ba51fe4b582f3f4` (`userId`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_e0522c4be8bab20520896919da0` (`createdById`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`groupId`,`userId`),
  ADD KEY `FK_fdef099303bcf0ffd9a4a7b18f5` (`userId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2db9cf2b3ca111742793f6c37ce` (`senderId`),
  ADD KEY `FK_438f09ab5b4bbcd27683eac2a5e` (`groupId`),
  ADD KEY `FK_f548818d46a1315d4e1d5e62da5` (`recipientId`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_83489b37212a5a547bde8f89014` (`courseId`),
  ADD KEY `FK_4d7e153b3176d99d8851bf4fbc6` (`lecturerId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_692a909ee0fa9383e7859f9b406` (`userId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_48ce552495d14eae9b187bb671` (`name`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `resourceId` (`resourceId`),
  ADD KEY `approvedById` (`approvedById`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `typeId` (`typeId`);

--
-- Indexes for table `resource_types`
--
ALTER TABLE `resource_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_648e3f5447f725579d7d4ffdfb` (`name`);

--
-- Indexes for table `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD PRIMARY KEY (`rolesId`,`permissionsId`),
  ADD KEY `IDX_bf98d8fd47610db71dfc5a4a5f` (`rolesId`),
  ADD KEY `IDX_f25fd350775094ceb3a02c1468` (`permissionsId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD KEY `FK_user_role` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resource_types`
--
ALTER TABLE `resource_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `FK_08486e3f0fccc870023753db07e` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e8bc6827c71ad19f5645eeed081` FOREIGN KEY (`reservedById`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `FK_3fff66ead8c0964a1805eb194b3` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `FK_60dd0ae4e21002e63a5fdefeec8` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_bf3ba3dfa95e2df7388eb4589fd` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_1024d476207981d1c72232cf3ca` FOREIGN KEY (`organizerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8a92756d1f59cf7000bb84f4e44` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `FK_07eb323a7b08ba51fe4b582f3f4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_21056813ffb169d392d38a40c2d` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `FK_e0522c4be8bab20520896919da0` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `FK_1aa8d31831c3126947e7a713c2b` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fdef099303bcf0ffd9a4a7b18f5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_2db9cf2b3ca111742793f6c37ce` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_438f09ab5b4bbcd27683eac2a5e` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f548818d46a1315d4e1d5e62da5` FOREIGN KEY (`recipientId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `FK_4d7e153b3176d99d8851bf4fbc6` FOREIGN KEY (`lecturerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_83489b37212a5a547bde8f89014` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_692a909ee0fa9383e7859f9b406` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`),
  ADD CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`approvedById`) REFERENCES `users` (`id`);

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `resource_types` (`id`);

--
-- Constraints for table `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD CONSTRAINT `FK_bf98d8fd47610db71dfc5a4a5ff` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_f25fd350775094ceb3a02c14681` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_user_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
