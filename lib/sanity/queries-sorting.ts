import { groq } from "next-sanity";

// Parents Hub Content Query - Alphabetical sorting
export const parentsHubContentQueryAlphabetical = groq`
  *[
    _type in ["article","recipe","activity"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(excerpt) && lower(excerpt) match $search) ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(body) && lower(pt::text(body)) match $search) ||
      (defined(instructions) && lower(pt::text(instructions)) match $search) ||
      (defined(steps) && lower(pt::text(steps)) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $categories == null ||
      count($categories) == 0 ||
      (defined(category) && category->slug.current in $categories)
    ) &&
    (
      $tag == null ||
      $tag == "" ||
      count(tags[]->slug.current[slug.current == $tag]) > 0
    )
  ]
  | order(title asc)
  [$start...$end]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    summary,
    body,
    coverImage,
    secondaryImage,
    publishedAt,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;

// Activities Hub Content Query - Alphabetical sorting
export const activitiesHubContentQueryAlphabetical = groq`
  *[
    _type in ["activity","printable"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(goals) && count(goals[lower(@) match $search]) > 0) ||
      (defined(materials) && count(materials[lower(@) match $search]) > 0) ||
      (defined(steps) && lower(pt::text(steps)) match $search) ||
      (defined(safetyNotes) && lower(safetyNotes) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $type == null ||
      $type == "" ||
      _type == $type
    )
  ]
  | order(title asc)
  [$start...$end]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    secondaryImage,
    publishedAt,
    duration,
    goals,
    materials,
    steps,
    safetyNotes,
    file,
    previewImages,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;

// Query to fetch ALL items for popular sorting (no pagination)
export const parentsHubContentAllQuery = groq`
  *[
    _type in ["article","recipe","activity"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(excerpt) && lower(excerpt) match $search) ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(body) && lower(pt::text(body)) match $search) ||
      (defined(instructions) && lower(pt::text(instructions)) match $search) ||
      (defined(steps) && lower(pt::text(steps)) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $categories == null ||
      count($categories) == 0 ||
      (defined(category) && category->slug.current in $categories)
    ) &&
    (
      $tag == null ||
      $tag == "" ||
      count(tags[]->slug.current[slug.current == $tag]) > 0
    )
  ]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    summary,
    body,
    coverImage,
    secondaryImage,
    publishedAt,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;

export const activitiesHubContentAllQuery = groq`
  *[
    _type in ["activity","printable"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(goals) && count(goals[lower(@) match $search]) > 0) ||
      (defined(materials) && count(materials[lower(@) match $search]) > 0) ||
      (defined(steps) && lower(pt::text(steps)) match $search) ||
      (defined(safetyNotes) && lower(safetyNotes) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $type == null ||
      $type == "" ||
      _type == $type
    )
  ]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    secondaryImage,
    publishedAt,
    duration,
    goals,
    materials,
    steps,
    safetyNotes,
    file,
    previewImages,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;
