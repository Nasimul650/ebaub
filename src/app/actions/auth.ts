'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()
  const portal = (formData.get('portal') as string || '').toLowerCase().trim()
  const redirectTo = (formData.get('redirectTo') as string || '').trim()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch user profile to determine role
  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  let role = profile?.role

  // Dynamic profile creation / fallback if missing
  if (!role) {
    const isTeacher = email.toLowerCase().includes('teacher') || portal === 'teacher'
    const isAdmin = email.toLowerCase().includes('admin') || portal === 'admin'
    const fallbackRole = isAdmin ? 'ADMIN' : (isTeacher ? 'TEACHER' : 'STUDENT')
    
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email || email,
      role: fallbackRole,
    })
    role = fallbackRole
  }

  // If email clearly designates teacher but profile was initialized as STUDENT, align it
  if (email.toLowerCase().includes('teacher') && role === 'STUDENT') {
    await supabase.from('profiles').update({ role: 'TEACHER' }).eq('id', data.user.id)
    role = 'TEACHER'
  }

  // 1. Explicit target portal takes highest priority
  if (portal === 'admin') {
    if (role === 'ADMIN') {
      redirect('/admin')
    }
  } else if (portal === 'teacher') {
    if (role === 'TEACHER' || role === 'ADMIN') {
      redirect('/teacher')
    }
  } else if (portal === 'student') {
    redirect('/student')
  }

  // 2. Generic safe redirectTo if portal was not explicitly chosen
  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    if (redirectTo.startsWith('/admin') && role === 'ADMIN') {
      redirect('/admin')
    } else if (redirectTo.startsWith('/teacher') && (role === 'TEACHER' || role === 'ADMIN')) {
      redirect('/teacher')
    } else if (redirectTo.startsWith('/student')) {
      redirect('/student')
    } else if (role !== 'STUDENT') {
      redirect(redirectTo)
    }
  }

  // 3. Fallback based on role
  if (role === 'ADMIN') {
    redirect('/admin')
  } else if (role === 'TEACHER') {
    redirect('/teacher')
  } else if (role === 'STUDENT') {
    redirect('/student')
  } else {
    redirect('/')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
