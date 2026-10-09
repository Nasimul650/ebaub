import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Define route categories
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/cms')
  const isTeacherPath = pathname.startsWith('/teacher')
  const isStudentPath = pathname.startsWith('/student')
  const isSettingsPath = pathname.startsWith('/settings')
  const isProtected = isAdminPath || isTeacherPath || isStudentPath || isSettingsPath
  const isLoginPath = pathname.startsWith('/login')

  // Helper to preserve cookies across redirects
  const createRedirectResponse = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // Helper to resolve role's appropriate home dashboard
  const getRoleDashboard = (targetRole: string) => {
    if (targetRole === 'admin') return '/admin'
    if (targetRole === 'teacher') return '/teacher'
    return '/student'
  }

  // 1. Authenticated User on Login Page Guard:
  // Logged-in users (Admin, Teacher, Student) cannot access the login page
  if (user && isLoginPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase()
    const role = rawRole === 'admin' ? 'admin' : rawRole === 'teacher' ? 'teacher' : 'student'

    const url = request.nextUrl.clone()
    url.pathname = getRoleDashboard(role)
    url.search = '' // Clear query parameters (e.g. ?portal=..., ?redirectTo=...)
    return createRedirectResponse(url)
  }

  // 2. Unauthenticated Guard: Redirect unauthenticated requests to /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    if (isAdminPath) {
      url.searchParams.set('portal', 'admin')
    } else if (isTeacherPath) {
      url.searchParams.set('portal', 'teacher')
    } else if (isStudentPath) {
      url.searchParams.set('portal', 'student')
    }
    return createRedirectResponse(url)
  }

  // 3. Strict Role-Based Route Protection for Protected Dashboards
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const rawRole = (profile?.role || user.user_metadata?.role || 'student').toString().toLowerCase()
    const role = rawRole === 'admin' ? 'admin' : rawRole === 'teacher' ? 'teacher' : 'student'

    // Admin Guard: /admin and /cms strictly require admin role
    if (isAdminPath && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = getRoleDashboard(role)
      return createRedirectResponse(url)
    }

    // Teacher Guard: /teacher strictly requires teacher role
    if (isTeacherPath && role !== 'teacher') {
      const url = request.nextUrl.clone()
      url.pathname = getRoleDashboard(role)
      return createRedirectResponse(url)
    }

    // Student Guard: /student strictly requires student role
    if (isStudentPath && role !== 'student') {
      const url = request.nextUrl.clone()
      url.pathname = getRoleDashboard(role)
      return createRedirectResponse(url)
    }
  }

  return supabaseResponse
}
