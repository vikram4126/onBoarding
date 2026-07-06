# 📱 KPMG Onboarding – PowerApps Implementation Guide

> **Based on:** Existing React onboarding web app  
> **Platform:** Microsoft Power Apps (Canvas App)  
> **Data:** SharePoint Online Lists (No Dataverse)  
> **Roles Covered:** Employee · Buddy · Leader · Manager

---

## 📑 Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [SharePoint Lists – Full Setup](#2-sharepoint-lists--full-setup)
3. [PowerApps App Setup](#3-powerapps-app-setup)
4. [Global Variables & OnStart](#4-global-variables--onstart)
5. [Screen: Login / Role Selection](#5-screen-login--role-selection)
6. [Screen: Employee Dashboard (Accordion + Progress)](#6-screen-employee-dashboard-accordion--progress)
7. [Screen: Buddy Dashboard](#7-screen-buddy-dashboard)
8. [Screen: Leader Dashboard](#8-screen-leader-dashboard)
9. [Screen: Manager Dashboard](#9-screen-manager-dashboard)
10. [Formulas Quick Reference](#10-formulas-quick-reference)

---

## 1. Overview & Architecture

### What This App Does
- Employee logs in → sees **Day-wise & Month-wise accordion** tasks
- Each **checkbox click** marks task complete → **overall progress bar** updates live
- Buddy sees tasks assigned to them for their assigned new joiners
- Leader sees team-level summary and progress
- Manager sees all employees, their progress, missed tasks

### Data Flow
```
SharePoint Lists
      │
      ▼
PowerApps Canvas App
      │
      ├── Employee Screen  → reads/writes OnboardingTasks
      ├── Buddy Screen     → reads BuddyTasks
      ├── Leader Screen    → reads OnboardingTasks (read-only)
      └── Manager Screen   → reads all lists (read-only)
```

---

## 2. SharePoint Lists – Full Setup

> Go to your SharePoint site → **Site Contents → New → List**

### 📋 List 1: `OnboardingTasks`
*Employee ke saare tasks yahan store honge*

| Column Name      | Type                     | Required | Notes                          |
|------------------|--------------------------|----------|--------------------------------|
| `Title`          | Single line of text      | ✅       | Task name                      |
| `Description`    | Multiple lines of text   | ❌       | Task details                   |
| `DayNumber`      | Number                   | ✅       | 1 to 30                        |
| `MonthNumber`    | Number                   | ✅       | 1, 2, or 3                     |
| `WeekNumber`     | Number                   | ❌       | Optional: 1 to 4               |
| `Status`         | Choice                   | ✅       | Choices: `Pending`, `Completed`|
| `EmployeeEmail`  | Single line of text      | ✅       | User().Email                   |
| `Category`       | Single line of text      | ❌       | e.g. IT, HR, Finance           |
| `PortalURL`      | Hyperlink                | ❌       | Link to portal                 |
| `PortalName`     | Single line of text      | ❌       | e.g. TalentKonnect             |
| `TaskType`       | Choice                   | ✅       | Choices: `Standard`, `Custom`  |
| `DeadlineDay`    | Number                   | ❌       | Which day it must be done by   |
| `CompletedOn`    | Date and Time            | ❌       | Auto-set when completed        |
| `Notes`          | Multiple lines of text   | ❌       | Employee's remark/comment      |

> **Default Status** set karo = `Pending` (list settings → column → default value)

---

### 📋 List 2: `EmployeeProfiles`
*Employee ki profile info store karne ke liye*

| Column Name      | Type                   | Required | Notes                            |
|------------------|------------------------|----------|----------------------------------|
| `Title`          | Single line of text    | ✅       | Employee full name               |
| `EmployeeEmail`  | Single line of text    | ✅       | User's email (unique key)        |
| `Team`           | Choice                 | ✅       | Dev, QA, HR, Finance, etc.       |
| `Designation`    | Single line of text    | ❌       | Job title                        |
| `JoiningDate`    | Date and Time          | ✅       | Date of joining                  |
| `ManagerEmail`   | Single line of text    | ❌       | Assigned manager's email         |
| `BuddyEmail`     | Single line of text    | ❌       | Assigned buddy's email           |
| `LeaderEmail`    | Single line of text    | ❌       | Assigned leader's email          |

---

### 📋 List 3: `BuddyTasks`
*Buddy ke liye tasks – new joiner ko help karna*

| Column Name       | Type                   | Required | Notes                            |
|-------------------|------------------------|----------|----------------------------------|
| `Title`           | Single line of text    | ✅       | Buddy task name                  |
| `Description`     | Multiple lines of text | ❌       | Task details                     |
| `DayNumber`       | Number                 | ✅       | 1 to 30                          |
| `MonthNumber`     | Number                 | ✅       | 1, 2, or 3                       |
| `Status`          | Choice                 | ✅       | `Pending`, `Completed`           |
| `BuddyEmail`      | Single line of text    | ✅       | Buddy's email                    |
| `AssignedToEmail` | Single line of text    | ✅       | New joiner's email               |
| `Notes`           | Multiple lines of text | ❌       | Buddy's note                     |
| `CompletedOn`     | Date and Time          | ❌       | Auto-set when completed          |

---

### 📋 List 4: `AppUsers`
*Role management – kaun Manager hai, kaun Buddy hai*

| Column Name   | Type                | Required | Notes                                        |
|---------------|---------------------|----------|----------------------------------------------|
| `Title`       | Single line of text | ✅       | User full name                               |
| `UserEmail`   | Single line of text | ✅       | User's email                                 |
| `Role`        | Choice              | ✅       | Choices: `Employee`, `Buddy`, `Leader`, `Manager` |
| `IsActive`    | Yes/No              | ✅       | Default: Yes                                 |

---

### 📋 List 5: `TaskMasterTemplate`
*Manager tasks template banane ke liye (pre-defined tasks)*

| Column Name    | Type                   | Required | Notes                     |
|----------------|------------------------|----------|---------------------------|
| `Title`        | Single line of text    | ✅       | Task name                 |
| `Description`  | Multiple lines of text | ❌       | Task detail               |
| `DayNumber`    | Number                 | ✅       | Default day               |
| `MonthNumber`  | Number                 | ✅       | 1, 2, or 3                |
| `Category`     | Single line of text    | ❌       | Category                  |
| `PortalURL`    | Hyperlink              | ❌       | Portal link               |
| `PortalName`   | Single line of text    | ❌       | Portal display name       |
| `IsActive`     | Yes/No                 | ✅       | Default: Yes              |

---

## 3. PowerApps App Setup

### Step 1: Create Canvas App
```
Power Apps Studio → Create → Canvas App from Blank
Name: KPMG Onboarding
Format: Tablet (1366 x 768) or Phone
```

### Step 2: Connect All SharePoint Lists
```
Left panel → Data → Add data → SharePoint
Site URL: https://[your-company].sharepoint.com/sites/[your-site]

Add these lists one by one:
✅ OnboardingTasks
✅ EmployeeProfiles
✅ BuddyTasks
✅ AppUsers
✅ TaskMasterTemplate
```

### Step 3: Add 5 Screens
```
Screens (rename them):
1. scrLogin       → Login / Role selection
2. scrEmployee    → Employee Dashboard
3. scrBuddy       → Buddy Dashboard
4. scrLeader      → Leader Dashboard
5. scrManager     → Manager Dashboard
```

---

## 4. Global Variables & OnStart

> **App → OnStart** mein ye formulas daalo (App select karo, OnStart property)

```powerapps
// ── Step 1: Current user ka email
Set(varUserEmail, Lower(User().Email));

// ── Step 2: Current user ka role check karo AppUsers list se
Set(
    varCurrentUser,
    LookUp(AppUsers, Lower(UserEmail) = varUserEmail)
);

Set(varUserRole, varCurrentUser.Role.Value);  // "Employee" / "Buddy" / "Leader" / "Manager"
Set(varUserName,  varCurrentUser.Title);

// ── Step 3: Employee profile
Set(
    varMyProfile,
    LookUp(EmployeeProfiles, Lower(EmployeeEmail) = varUserEmail)
);

// ── Step 4: Joining date se current day number calculate karo
Set(
    varCurrentDay,
    If(
        IsBlank(varMyProfile.JoiningDate),
        1,
        Max(1, DateDiff(varMyProfile.JoiningDate, Today(), Days) + 1)
    )
);

// ── Step 5: Accordion variables reset
Set(varExpandedMonth, 0);
Set(varExpandedDay,   "");
Set(varExpandedBuddyDay, "");

// ── Step 6: Route to correct screen based on role
Switch(
    varUserRole,
    "Manager", Navigate(scrManager,  ScreenTransition.Fade),
    "Buddy",   Navigate(scrBuddy,    ScreenTransition.Fade),
    "Leader",  Navigate(scrLeader,   ScreenTransition.Fade),
               Navigate(scrEmployee, ScreenTransition.Fade)  // default: Employee
);
```

---

## 5. Screen: Login / Role Selection (`scrLogin`)

### Layout
```
┌─────────────────────────────────────┐
│          KPMG Logo                  │
│       "Welcome Aboard!"             │
│                                     │
│  [Employee] [Buddy] [Leader] [Mgr]  │
│                                     │
│  Name:  _______________             │
│  Email: _______________             │
│                                     │
│       [Start My Journey]            │
└─────────────────────────────────────┘
```

### Controls & Formulas

**Variable for selected role tab:**
```powerapps
// Button "Employee" OnSelect:
Set(varSelectedRole, "Employee")

// Button "Buddy" OnSelect:
Set(varSelectedRole, "Buddy")

// Button "Leader" OnSelect:
Set(varSelectedRole, "Leader")

// Button "Manager" OnSelect:
Set(varSelectedRole, "Manager")
```

**Role button – selected style (Fill property):**
```powerapps
// Blue background if this role is selected, else light grey
If(varSelectedRole = "Employee", ColorValue("#0078D4"), Color.LightGray)
```

**Submit Button OnSelect:**
```powerapps
// Check if user exists in AppUsers
Set(
    varLoginUser,
    LookUp(AppUsers, Lower(UserEmail) = Lower(txtEmail.Text), IsActive = true)
);

If(
    IsBlank(varLoginUser),
    // New employee – create profile and tasks from template
    If(
        varSelectedRole = "Employee",
        // 1. Create employee profile
        Patch(
            EmployeeProfiles,
            Defaults(EmployeeProfiles),
            {
                Title:         txtName.Text,
                EmployeeEmail: Lower(txtEmail.Text),
                Team:          drpTeam.Selected.Value,
                JoiningDate:   dtpJoiningDate.SelectedDate
            }
        );
        // 2. Copy tasks from TaskMasterTemplate to OnboardingTasks
        ForAll(
            Filter(TaskMasterTemplate, IsActive = true),
            Patch(
                OnboardingTasks,
                Defaults(OnboardingTasks),
                {
                    Title:         ThisRecord.Title,
                    Description:   ThisRecord.Description,
                    DayNumber:     ThisRecord.DayNumber,
                    MonthNumber:   ThisRecord.MonthNumber,
                    Category:      ThisRecord.Category,
                    PortalURL:     ThisRecord.PortalURL,
                    PortalName:    ThisRecord.PortalName,
                    Status:        {Value: "Pending"},
                    TaskType:      {Value: "Standard"},
                    EmployeeEmail: Lower(txtEmail.Text)
                }
            )
        );
        // 3. Create AppUsers entry
        Patch(
            AppUsers,
            Defaults(AppUsers),
            {
                Title:     txtName.Text,
                UserEmail: Lower(txtEmail.Text),
                Role:      {Value: "Employee"},
                IsActive:  true
            }
        );
        Set(varUserEmail, Lower(txtEmail.Text));
        Set(varUserRole, "Employee");
        Set(varUserName, txtName.Text);
        Set(varMyProfile, LookUp(EmployeeProfiles, Lower(EmployeeEmail) = Lower(txtEmail.Text)));
        Set(varCurrentDay, Max(1, DateDiff(dtpJoiningDate.SelectedDate, Today(), Days) + 1));
        Navigate(scrEmployee, ScreenTransition.Fade),

        // Non-employee role not found → show error
        Notify("User not found. Please contact your administrator.", NotificationType.Error)
    ),

    // Existing user found → set variables and navigate
    Set(varUserEmail, Lower(txtEmail.Text));
    Set(varUserRole, varLoginUser.Role.Value);
    Set(varUserName, varLoginUser.Title);
    Set(varMyProfile, LookUp(EmployeeProfiles, Lower(EmployeeEmail) = Lower(txtEmail.Text)));
    Set(varCurrentDay, Max(1, DateDiff(varMyProfile.JoiningDate, Today(), Days) + 1));
    Switch(
        varLoginUser.Role.Value,
        "Manager", Navigate(scrManager,  ScreenTransition.Fade),
        "Buddy",   Navigate(scrBuddy,    ScreenTransition.Fade),
        "Leader",  Navigate(scrLeader,   ScreenTransition.Fade),
                   Navigate(scrEmployee, ScreenTransition.Fade)
    )
);
```

---

## 6. Screen: Employee Dashboard (`scrEmployee`)

### Layout
```
┌──────────────────────────────────────────────────┐
│ KPMG Logo   |  Welcome, [Name]        [Logout]   │
├──────────────────────────────────────────────────┤
│ Overall Progress: ████████░░░░  72%              │
│ Completed: 18/25 tasks                           │
├──────────────────────────────────────────────────┤
│ ▼ Month 1  [8/10 done]                           │
│   ▶ Day 1  [2/2 done] ✓                          │
│   ▼ Day 2  [1/2 done]                            │
│      ☑ Complete IT setup form                    │
│      ☐ Register on TalentKonnect                 │
│   ▶ Day 3  [0/3 done]                            │
│ ▶ Month 2  [4/8 done]                            │
└──────────────────────────────────────────────────┘
```

---

### 6A. Overall Progress Bar

**Add Rectangle control → name it `rectProgressBg`**
```powerapps
// Width (background - full bar):
500   // fixed width

// Height: 16
// Fill: RGBA(220, 220, 220, 1)
```

**Add another Rectangle → name it `rectProgressFill`**
```powerapps
// Width formula (fills according to progress):
(
    CountIf(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail)) = 0,
        1,
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail))
    )
) * 500

// Fill: RGBA(0, 120, 212, 1)   ← Blue (KPMG color)
// Height: 16
// X: same as rectProgressBg X
// Y: same as rectProgressBg Y
```

**Progress % Label:**
```powerapps
Text(
    CountIf(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail)) = 0,
        1,
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail))
    ),
    "[$-en-US]0%"
)
```

**Completed count label:**
```powerapps
"Completed: " &
CountIf(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail), Status.Value = "Completed") &
"/" &
CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail)) &
" tasks"
```

---

### 6B. Month Accordion (Outer Gallery)

**Add Vertical Gallery → name it `galMonths`**

```powerapps
// Items:
Sort(
    Distinct(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = varUserEmail),
        MonthNumber
    ),
    Result,
    SortOrder.Ascending
)

// TemplateHeight: 50 (just the header row)
// ShowScrollbar: false
```

**Inside galMonths – Add Button (Month Header):**
```powerapps
// Text:
"Month " & Text(ThisItem.Result) &
"   [" &
CountIf(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = varUserEmail,
        MonthNumber = ThisItem.Result
    ),
    Status.Value = "Completed"
) & "/" &
CountRows(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = varUserEmail,
        MonthNumber = ThisItem.Result
    )
) & " done]"

// OnSelect:
If(
    varExpandedMonth = ThisItem.Result,
    Set(varExpandedMonth, 0),    // collapse
    Set(varExpandedMonth, ThisItem.Result)  // expand
);
Set(varExpandedDay, "")  // close all day accordions when switching month

// Fill: RGBA(0, 120, 212, 0.1)
// FontWeight: FontWeight.Bold
```

**Arrow icon on month button:**
```powerapps
// Text (chevron):
If(varExpandedMonth = ThisItem.Result, "▼", "▶")
```

---

### 6C. Day Accordion (Inner Gallery – inside month)

> Place this gallery **below** the month header inside `galMonths`. Set its `Visible` to show only when month is expanded.

**Add Vertical Gallery → name it `galDays`**

```powerapps
// Items:
Sort(
    Distinct(
        Filter(OnboardingTasks,
            Lower(EmployeeEmail) = varUserEmail,
            MonthNumber = galMonths.Selected.Result
        ),
        DayNumber
    ),
    Result,
    SortOrder.Ascending
)

// Visible:
varExpandedMonth = galMonths.Selected.Result

// TemplateHeight: 44
```

**Inside galDays – Day Header Button:**
```powerapps
// Text:
"Day " & Text(ThisItem.Result) &
"  " &
CountIf(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = varUserEmail,
        MonthNumber = galMonths.Selected.Result,
        DayNumber = ThisItem.Result
    ),
    Status.Value = "Completed"
) & "/" &
CountRows(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = varUserEmail,
        MonthNumber = galMonths.Selected.Result,
        DayNumber = ThisItem.Result
    )
) & " done"

// OnSelect:
If(
    varExpandedDay = Text(galMonths.Selected.Result) & "_" & Text(ThisItem.Result),
    Set(varExpandedDay, ""),
    Set(varExpandedDay, Text(galMonths.Selected.Result) & "_" & Text(ThisItem.Result))
)
// Note: We combine Month+Day as unique key e.g. "1_3" = Month 1, Day 3

// Fill - green if all done, else blue:
If(
    CountIf(
        Filter(OnboardingTasks,
            Lower(EmployeeEmail) = varUserEmail,
            MonthNumber = galMonths.Selected.Result,
            DayNumber = ThisItem.Result
        ),
        Status.Value = "Completed"
    )
    =
    CountRows(
        Filter(OnboardingTasks,
            Lower(EmployeeEmail) = varUserEmail,
            MonthNumber = galMonths.Selected.Result,
            DayNumber = ThisItem.Result
        )
    ),
    RGBA(16, 124, 65, 0.15),    // all done → green tint
    RGBA(0, 120, 212, 0.07)     // pending  → blue tint
)
```

---

### 6D. Task List (Innermost – inside day)

**Add Vertical Gallery → name it `galTasks`**

```powerapps
// Items:
Filter(
    OnboardingTasks,
    Lower(EmployeeEmail) = varUserEmail,
    MonthNumber = galMonths.Selected.Result,
    DayNumber = galDays.Selected.Result
)

// Visible:
varExpandedDay = Text(galMonths.Selected.Result) & "_" & Text(galDays.Selected.Result)

// TemplateHeight: 64
```

**Inside galTasks – Checkbox:**
```powerapps
// Default (checked state):
ThisItem.Status.Value = "Completed"

// OnCheck (when user ticks):
Patch(
    OnboardingTasks,
    ThisItem,
    {
        Status:      {Value: "Completed"},
        CompletedOn: Now()
    }
);
Notify("✓ Task marked complete!", NotificationType.Success)

// OnUncheck (when user unticks):
Patch(
    OnboardingTasks,
    ThisItem,
    {
        Status:      {Value: "Pending"},
        CompletedOn: Blank()
    }
);
Notify("Task marked as pending.", NotificationType.Information)
```

**Inside galTasks – Task Title Label:**
```powerapps
// Text:
ThisItem.Title

// Font: If(ThisItem.Status.Value = "Completed", Font.'Segoe UI', Font.'Segoe UI')
// Color: If(ThisItem.Status.Value = "Completed", Color.Gray, Color.Black)
// Strikethrough: ThisItem.Status.Value = "Completed"
```

**Inside galTasks – Category/Portal Button (optional):**
```powerapps
// Text:
ThisItem.PortalName

// Visible:
!IsBlank(ThisItem.PortalName)

// OnSelect:
Launch(ThisItem.PortalURL)
```

**Inside galTasks – Due Status Label:**
```powerapps
// Text (due status logic):
If(
    ThisItem.Status.Value = "Completed",
    "✓ Completed",
    If(
        IsBlank(ThisItem.DeadlineDay),
        "Pending",
        If(
            varCurrentDay = ThisItem.DeadlineDay,
            "⚠ Due Today",
            If(
                varCurrentDay > ThisItem.DeadlineDay + 1,
                "🔴 Overdue",
                If(
                    varCurrentDay = ThisItem.DeadlineDay + 1,
                    "🔴 Due Yesterday",
                    "📅 Due Day " & Text(ThisItem.DeadlineDay)
                )
            )
        )
    )
)

// Color:
Switch(
    true,
    ThisItem.Status.Value = "Completed",          Color.DarkGreen,
    !IsBlank(ThisItem.DeadlineDay) && varCurrentDay > ThisItem.DeadlineDay + 1, Color.Red,
    !IsBlank(ThisItem.DeadlineDay) && varCurrentDay = ThisItem.DeadlineDay,     Color.DarkOrange,
    Color.Gray
)
```

**Inside galTasks – Notes/Comment TextInput:**
```powerapps
// Default:
ThisItem.Notes

// OnChange:
Patch(
    OnboardingTasks,
    ThisItem,
    {Notes: Self.Text}
)
```

---

## 7. Screen: Buddy Dashboard (`scrBuddy`)

### What Buddy Sees
- Their own assigned tasks from `BuddyTasks` list
- Progress of new joiners assigned to them (read-only)
- Day-wise accordion same as Employee screen

### Layout
```
┌──────────────────────────────────────────────────┐
│ KPMG Logo  |  Buddy: [Name]          [Logout]    │
├──────────────────────────────────────────────────┤
│ My Buddy Tasks Progress: ████░░  65%             │
├──────────────────────────────────────────────────┤
│ [My Tasks] [My New Joiners]  ← Tab buttons       │
├──────────────────────────────────────────────────┤
│ TAB: My Tasks                                    │
│  ▼ Day 1   [2/3 done]                            │
│     ☑ Introduce yourself to new joiner           │
│     ☑ Share team contact list                    │
│     ☐ Setup 1:1 calendar invite                  │
│  ▶ Day 2   [1/2 done]                            │
└──────────────────────────────────────────────────┘
```

### 7A. Buddy Progress Bar

```powerapps
// Progress fill width:
(
    CountIf(
        Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail)) = 0,
        1,
        CountRows(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail))
    )
) * 500

// Progress % text:
Text(
    CountIf(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail), Status.Value = "Completed")
    /
    If(CountRows(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail)) = 0, 1,
       CountRows(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail))),
    "[$-en-US]0%"
)
```

### 7B. Tab Switching

```powerapps
// Variable for active tab:
// Set in OnStart:
Set(varBuddyTab, "MyTasks")

// "My Tasks" button OnSelect:
Set(varBuddyTab, "MyTasks")

// "My New Joiners" button OnSelect:
Set(varBuddyTab, "MyJoiners")

// Button fill (active state):
If(varBuddyTab = "MyTasks", RGBA(0,120,212,1), RGBA(220,220,220,1))
```

### 7C. Buddy Tasks Day Accordion

**Day Gallery Items (BuddyTasks):**
```powerapps
Sort(
    Distinct(
        Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail),
        DayNumber
    ),
    Result,
    SortOrder.Ascending
)

// Visible: varBuddyTab = "MyTasks"
```

**Day Header text:**
```powerapps
"Day " & Text(ThisItem.Result) &
"  [" &
CountIf(
    Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail, DayNumber = ThisItem.Result),
    Status.Value = "Completed"
) & "/" &
CountRows(Filter(BuddyTasks, Lower(BuddyEmail) = varUserEmail, DayNumber = ThisItem.Result)) &
" done]"
```

**Day Header OnSelect:**
```powerapps
If(
    varExpandedBuddyDay = Text(ThisItem.Result),
    Set(varExpandedBuddyDay, ""),
    Set(varExpandedBuddyDay, Text(ThisItem.Result))
)
```

**Buddy Task Checkbox OnCheck:**
```powerapps
Patch(
    BuddyTasks,
    ThisItem,
    {
        Status:      {Value: "Completed"},
        CompletedOn: Now()
    }
);
Notify("✓ Task completed!", NotificationType.Success)
```

**Buddy Task Checkbox OnUncheck:**
```powerapps
Patch(
    BuddyTasks,
    ThisItem,
    {Status: {Value: "Pending"}, CompletedOn: Blank()}
)
```

### 7D. My New Joiners Tab

**Gallery for assigned new joiners:**
```powerapps
// Items (all employees where BuddyEmail = current buddy):
Filter(EmployeeProfiles, Lower(BuddyEmail) = varUserEmail)

// Visible: varBuddyTab = "MyJoiners"
```

**New joiner progress % formula (inside gallery):**
```powerapps
// Progress label inside joiner gallery card:
Text(
    CountIf(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail))) = 0,
        1,
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)))
    ),
    "[$-en-US]0%"
)
```

---

## 8. Screen: Leader Dashboard (`scrLeader`)

### What Leader Sees
- Team-level summary: total employees, avg progress
- Each employee card with their progress %
- Click on employee → see their task breakdown (read-only)
- Overdue/missed task alerts

### Layout
```
┌──────────────────────────────────────────────────┐
│ KPMG Logo  |  Leader: [Name]         [Logout]    │
├──────────────────────────────────────────────────┤
│  Team Members: 12  |  Avg Progress: 68%          │
│  Fully Complete: 3 |  With Missed Tasks: 2       │
├──────────────────────────────────────────────────┤
│  [Vikram Singh]   ████████░░  78%  Day 14        │
│  [Priya Sharma]   ██████░░░░  62%  Day 9  🔴 2  │
│  [Arjun Mehta]    ██████████ 100%  ✓ Complete!   │
└──────────────────────────────────────────────────┘
```

### 8A. Team Summary Stats

```powerapps
// All employees under this leader:
// Set on screen OnVisible or App OnStart:
ClearCollect(
    colMyTeam,
    Filter(EmployeeProfiles, Lower(LeaderEmail) = varUserEmail)
);

// Total employees label:
"Team Members: " & CountRows(colMyTeam)

// Average progress label:
"Avg Progress: " &
Text(
    Average(
        AddColumns(
            colMyTeam,
            "EmpProgress",
            CountIf(
                Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(EmployeeEmail)),
                Status.Value = "Completed"
            ) /
            If(
                CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(EmployeeEmail))) = 0,
                1,
                CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(EmployeeEmail)))
            )
        ),
        EmpProgress
    ),
    "[$-en-US]0%"
)
```

### 8B. Employee List Gallery (Leader view)

```powerapps
// Items:
Filter(EmployeeProfiles, Lower(LeaderEmail) = varUserEmail)

// Template Height: 90
```

**Employee name label:**
```powerapps
ThisItem.Title & " · " & ThisItem.Team
```

**Employee progress % label:**
```powerapps
Text(
    CountIf(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail))) = 0,
        1,
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)))
    ),
    "[$-en-US]0%"
)
```

**Progress bar fill width (inside leader gallery card):**
```powerapps
(
    CountIf(
        Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)),
        Status.Value = "Completed"
    )
    /
    If(
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail))) = 0,
        1,
        CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)))
    )
) * 300   // 300 is the bar's max width in pixels
```

**Missed tasks alert (red badge):**
```powerapps
// Visible:
CountIf(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail),
        Status.Value <> "Completed"
    ),
    DayNumber < Max(1, DateDiff(ThisItem.JoiningDate, Today(), Days) + 1)
) > 0

// Text:
"🔴 " &
CountIf(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail),
        Status.Value <> "Completed"
    ),
    DayNumber < Max(1, DateDiff(ThisItem.JoiningDate, Today(), Days) + 1)
) & " missed"
```

**Current day label:**
```powerapps
"Day " & Text(Max(1, DateDiff(ThisItem.JoiningDate, Today(), Days) + 1))
```

**OnSelect (view employee detail):**
```powerapps
Set(varSelectedEmployee, ThisItem);
Navigate(scrEmployeeDetail, ScreenTransition.Fade)
// Create a 6th read-only screen: scrEmployeeDetail
```

---

## 9. Screen: Manager Dashboard (`scrManager`)

### What Manager Sees
- ALL employees (not just their team)
- Upload tasks from template (add to TaskMasterTemplate)
- See missed tasks count
- Filter by team

### Layout
```
┌──────────────────────────────────────────────────┐
│ KPMG Logo  |  Manager Dashboard      [Logout]    │
├──────────────────────────────────────────────────┤
│ [My Team] [Task Manager]   ← Tabs                │
├──────────────────────────────────────────────────┤
│ MY TEAM TAB:                                     │
│ Filter: [All Teams ▼]   Total: 24 employees      │
│                                                  │
│ [Vikram] Dev  ████████░  78%  Day 14             │
│ [Priya]  QA   ██████░░░  62%  Day 9  🔴 2 missed│
├──────────────────────────────────────────────────┤
│ TASK MANAGER TAB:                                │
│ [+ Add New Task Template]                        │
│ Day 1 | Month 1 | IT | Setup laptop access       │
│ Day 2 | Month 1 | HR | Complete joining forms    │
└──────────────────────────────────────────────────┘
```

### 9A. Manager Tab Toggle

```powerapps
// Variable: Set in OnStart → Set(varManagerTab, "Team")

// "My Team" button OnSelect:
Set(varManagerTab, "Team")

// "Task Manager" button OnSelect:
Set(varManagerTab, "Tasks");
ClearCollect(colTaskTemplates, TaskMasterTemplate)

// Tab fill (active highlight):
If(varManagerTab = "Team", RGBA(0,120,212,1), RGBA(220,220,220,1))
```

### 9B. Team Filter Dropdown

```powerapps
// Dropdown Items:
["All Teams", "Development", "QA", "Design", "HR", "Finance", "IT Support", "Marketing"]

// Set variable on change:
Set(varTeamFilter, drpTeamFilter.Selected.Value)
```

**Employee gallery filter by team:**
```powerapps
// Gallery Items:
If(
    varTeamFilter = "All Teams" || IsBlank(varTeamFilter),
    EmployeeProfiles,
    Filter(EmployeeProfiles, Team.Value = varTeamFilter)
)
```

### 9C. Manager – All Employees Gallery

**Same as Leader gallery but shows ALL employees:**

```powerapps
// Items:
If(
    varTeamFilter = "All Teams",
    EmployeeProfiles,
    Filter(EmployeeProfiles, Team.Value = varTeamFilter)
)
```

**Completed / Total task count label:**
```powerapps
CountIf(
    Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail)),
    Status.Value = "Completed"
) &
"/" &
CountRows(Filter(OnboardingTasks, Lower(EmployeeEmail) = Lower(ThisItem.EmployeeEmail))) &
" tasks"
```

### 9D. Task Manager Tab – Add New Template Task

**Add TextInput for task name, Number inputs for Day and Month, and Save button:**

```powerapps
// Save button OnSelect (adds new task to TaskMasterTemplate):
If(
    IsBlank(txtTaskTitle.Text),
    Notify("Please enter a task title.", NotificationType.Warning),
    Patch(
        TaskMasterTemplate,
        Defaults(TaskMasterTemplate),
        {
            Title:       txtTaskTitle.Text,
            Description: txtTaskDesc.Text,
            DayNumber:   Value(txtDayNumber.Text),
            MonthNumber: Value(txtMonthNumber.Text),
            Category:    txtCategory.Text,
            PortalURL:   txtPortalURL.Text,
            PortalName:  txtPortalName.Text,
            IsActive:    true
        }
    );
    Notify("✓ Task template added!", NotificationType.Success);
    ClearCollect(colTaskTemplates, TaskMasterTemplate);
    Reset(txtTaskTitle);
    Reset(txtTaskDesc)
)
```

**Task template gallery:**
```powerapps
// Items:
colTaskTemplates

// Or directly:
Sort(TaskMasterTemplate, DayNumber, SortOrder.Ascending)
```

**Delete template task:**
```powerapps
// Delete icon OnSelect:
Remove(TaskMasterTemplate, ThisItem);
ClearCollect(colTaskTemplates, TaskMasterTemplate);
Notify("Task template deleted.", NotificationType.Information)
```

---

## 10. Formulas Quick Reference

### 🔢 Progress Calculation (reusable pattern)

```powerapps
// Template – replace [FilterCondition] with your filter
CountIf(
    Filter(OnboardingTasks, [FilterCondition]),
    Status.Value = "Completed"
)
/
If(
    CountRows(Filter(OnboardingTasks, [FilterCondition])) = 0,
    1,
    CountRows(Filter(OnboardingTasks, [FilterCondition]))
)

// Example for current employee:
// [FilterCondition] = Lower(EmployeeEmail) = varUserEmail
```

### ✅ Mark Task Complete (Patch)

```powerapps
Patch(
    OnboardingTasks,    // or BuddyTasks
    ThisItem,
    {
        Status:      {Value: "Completed"},
        CompletedOn: Now()
    }
)
```

### ❌ Mark Task Pending (Patch)

```powerapps
Patch(
    OnboardingTasks,
    ThisItem,
    {Status: {Value: "Pending"}, CompletedOn: Blank()}
)
```

### 📅 Calculate Current Day

```powerapps
Max(1, DateDiff(varMyProfile.JoiningDate, Today(), Days) + 1)
```

### 🎯 Check if Task is Overdue

```powerapps
// Returns true if task is overdue:
!IsBlank(ThisItem.DeadlineDay) &&
ThisItem.Status.Value <> "Completed" &&
varCurrentDay > ThisItem.DeadlineDay
```

### 🔑 Accordion Key (unique key for Month+Day)

```powerapps
// To create a unique key for each day inside a month:
Text(galMonths.Selected.Result) & "_" & Text(ThisItem.Result)
// e.g. "1_3" = Month 1, Day 3
// e.g. "2_7" = Month 2, Day 7
```

### 📊 Missed Tasks Count (for any employee)

```powerapps
CountIf(
    Filter(OnboardingTasks,
        Lower(EmployeeEmail) = Lower(varTargetEmail),   // replace varTargetEmail
        Status.Value <> "Completed",
        !IsBlank(DayNumber)
    ),
    DayNumber < Max(1, DateDiff(varMyProfile.JoiningDate, Today(), Days) + 1)
)
```

### 🧭 Navigate Back

```powerapps
// Back button OnSelect:
Navigate(scrEmployee, ScreenTransition.Fade)

// Logout button OnSelect:
Set(varUserEmail, "");
Set(varUserRole, "");
Set(varUserName, "");
Set(varMyProfile, Blank());
Navigate(scrLogin, ScreenTransition.Fade)
```

---

## ⚙️ SharePoint Permission Setup

| Role     | `OnboardingTasks`     | `BuddyTasks`       | `EmployeeProfiles`  | `AppUsers`     | `TaskMasterTemplate` |
|----------|-----------------------|--------------------|---------------------|----------------|----------------------|
| Employee | Read + Write (own)    | No access          | Read (own)          | Read           | Read                 |
| Buddy    | Read only             | Read + Write (own) | Read (assigned)     | Read           | Read                 |
| Leader   | Read (team)           | Read               | Read (team)         | Read           | Read                 |
| Manager  | Full Read             | Full Read          | Full Read + Write   | Full Read+Write| Full Read + Write    |

> **Tip:** For row-level security, use SharePoint list permissions or handle in PowerApps by always filtering with `Lower(EmployeeEmail) = varUserEmail`.

---

## 🗂️ Suggested Screen Count

| Screen Name           | Purpose                                  |
|-----------------------|------------------------------------------|
| `scrLogin`            | Role selection + login                   |
| `scrEmployee`         | Employee accordion + progress            |
| `scrBuddy`            | Buddy tasks + new joiners overview       |
| `scrLeader`           | Team summary + employee cards            |
| `scrManager`          | All employees + task template manager    |
| `scrEmployeeDetail`   | Read-only employee task view (Leader/Mgr)|

---

## 📦 Sample Data to Add in SharePoint

### AppUsers list (add these rows manually):

| Title         | UserEmail              | Role     | IsActive |
|---------------|------------------------|----------|----------|
| Admin Manager | manager@kpmg.com       | Manager  | Yes      |
| Buddy One     | buddy1@kpmg.com        | Buddy    | Yes      |
| Leader One    | leader@kpmg.com        | Leader   | Yes      |

### TaskMasterTemplate list (sample rows):

| Title                          | DayNumber | MonthNumber | Category |
|--------------------------------|-----------|-------------|----------|
| Complete IT setup form         | 1         | 1           | IT       |
| Register on TalentKonnect      | 1         | 1           | HR       |
| Setup laptop and access cards  | 2         | 1           | IT       |
| Meet your buddy                | 2         | 1           | General  |
| Complete joining paperwork     | 3         | 1           | HR       |
| Attend orientation session     | 5         | 1           | Training |
| Setup email and Teams          | 1         | 1           | IT       |

---

> 📝 **Note:** This guide is based on the existing React onboarding web app logic.  
> React's `localStorage` → replaced with **SharePoint Lists**  
> React's `useState` → replaced with **PowerApps Variables (`Set()`)**  
> React's `.filter()` → replaced with **PowerApps `Filter()`**  
> React's checkbox `toggleTask()` → replaced with **`Patch()` to SharePoint**
